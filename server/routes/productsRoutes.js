import express from 'express';
import upload from '../config/multer.js';     // Cloudinary
import pool from '../config/db.js';
import { embedText } from '../ai-service/embedText.js';
import { toSql } from 'pgvector';

const router = express.Router();

// 🛠️ Helper to bump the sequence if needed (call once on startup)
async function syncSequence() {
  await pool.query(`
    SELECT setval(
      pg_get_serial_sequence('products','id'),
      (SELECT COALESCE(MAX(id), 1) FROM products)
    );
  `);
}
// call it once
syncSequence();

// --- CREATE
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image_url = req.file?.path || null;

    const textToEmbed = `${name} ${category||''} ${description||''}`;
    const embeddingArray = await embedText(textToEmbed);

    const result = await pool.query(
      `INSERT INTO products (name, price, description, image_url, category, embedding)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        name,
        price,
        description,
        image_url,
        category,
        toSql(embeddingArray)      // ← embed must be wrapped
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- SEMANTIC SEARCH
router.get('/products/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const emb = await embedText(query, 'search_query');
    const vectorParam = toSql(emb);   // ← wrap here too

    const { rows } = await pool.query(
      `SELECT *, embedding <#> $1 AS distance
       FROM products
       WHERE embedding IS NOT NULL
       ORDER BY embedding <#> $1
       LIMIT 15`,
      [vectorParam]
    );

    // keep only the top few that meet a threshold
    const filtered = rows.filter(r => r.distance < 0.35).slice(0, 7);
    if (filtered.length === 0) {
      // fallback keyword search
      const fallback = await pool.query(
        `SELECT * FROM products
         WHERE LOWER(name) LIKE $1 OR LOWER(description) LIKE $1
         LIMIT 10`,
        [`%${query.toLowerCase()}%`]
      );
      return res.json(fallback.rows);
    }
    return res.json(filtered.map(p => ({ ...p, similarity: 1 - p.distance })));
  } catch (err) {
    console.error('Error during semantic search:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- KEYWORD SEARCH / LIST ALL
router.get('/products', async (req, res) => {
  const { search } = req.query;
  try {
    if (!search) {
      const all = await pool.query('SELECT * FROM products ORDER BY id DESC');
      return res.json(all.rows);
    }

    // split into keywords, ignore tiny words
    const kws = search.toLowerCase().split(' ').filter(w => w.length > 2);
    if (kws.length === 0) {
      const all = await pool.query('SELECT * FROM products ORDER BY id DESC');
      return res.json(all.rows);
    }

    const conds = [];
    const vals = [];
    kws.forEach((kw,i) => {
      conds.push(`LOWER(name) LIKE $${2*i+1} OR LOWER(description) LIKE $${2*i+2}`);
      vals.push(`%${kw}%`, `%${kw}%`);
    });

    const sql = `SELECT * FROM products WHERE ${conds.join(' OR ')} ORDER BY id DESC`;
    const result = await pool.query(sql, vals);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- GET ONE
router.get('/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- UPDATE
router.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, existingImage } = req.body;
    const image_url = req.file?.path || existingImage || null;

    const textToEmbed = `${name} ${category||''} ${description||''}`;
    const embeddingArray = await embedText(textToEmbed);

    const result = await pool.query(
      `UPDATE products
       SET name=$1, price=$2, description=$3, image_url=$4, category=$5, embedding=$6
       WHERE id=$7 RETURNING *`,
      [
        name,
        price,
        description,
        image_url,
        category,
        toSql(embeddingArray),    // ← wrap again
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
