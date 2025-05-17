import express from 'express';
import upload from '../config/multer.js'; // Cloudinary upload
import pool from '../config/db.js';
import { embedText } from '../ai-service/embedText.js';
import { toSql } from 'pgvector';

const router = express.Router();

// --- POST /products ---
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image_url = req.file?.path || null;

    const textToEmbed = `${name} ${category || ''} ${description || ''}`;
    const embeddingArray = await embedText(textToEmbed);

    if (!embeddingArray || !Array.isArray(embeddingArray)) {
      throw new Error('Embedding failed');
    }

    const result = await pool.query(
      `INSERT INTO products (name, price, description, image_url, category, embedding)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, price, description, image_url, category, embeddingArray]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- GET /products/search ---
router.get('/products/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const emb = await embedText(query);
    const { rows } = await pool.query(
      `SELECT *, embedding <#> $1 AS distance
       FROM products
       WHERE embedding IS NOT NULL
       ORDER BY embedding <#> $1
       LIMIT 20`,
      [emb]
    );

    const filtered = rows.filter(r => r.distance < 0.3).slice(0, 7);

    if (filtered.length === 0) {
      const fallback = await pool.query(
        `SELECT * FROM products
         WHERE LOWER(name) LIKE $1 OR LOWER(description) LIKE $1
         LIMIT 10`,
        [`%${query.toLowerCase()}%`]
      );
      return res.json(fallback.rows);
    }

    res.json(filtered.map(p => ({
      ...p,
      similarity: 1 - p.distance
    })));
  } catch (err) {
    console.error('Error during search:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- GET /products ---
router.get('/products', async (req, res) => {
  const { search } = req.query;

  try {
    if (!search) {
      const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
      return res.json(result.rows);
    }

    const keywords = search.toLowerCase().split(' ').filter(w => w.length > 2);
    if (keywords.length === 0) {
      const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
      return res.json(result.rows);
    }

    const conditions = [];
    const values = [];

    keywords.forEach((kw, i) => {
      conditions.push(`LOWER(name) LIKE $${2 * i + 1} OR LOWER(description) LIKE $${2 * i + 2}`);
      values.push(`%${kw}%`, `%${kw}%`);
    });

    const sql = `SELECT * FROM products WHERE ${conditions.join(' OR ')} ORDER BY id DESC`;
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- GET /products/:id ---
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- PUT /products/:id ---
router.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, existingImage } = req.body;
    const { id } = req.params;
    const image_url = req.file?.path || existingImage || null;

    const textToEmbed = `${name} ${category || ''} ${description || ''}`;
    const embeddingArray = await embedText(textToEmbed);
    if (!embeddingArray || !Array.isArray(embeddingArray)) {
      throw new Error('Embedding failed');
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1, price = $2, description = $3, image_url = $4, category = $5, embedding = $6
       WHERE id = $7
       RETURNING *`,
      [name, price, description, image_url, category, embeddingArray, id]
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
