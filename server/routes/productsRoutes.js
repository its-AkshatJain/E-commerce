import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pool from '../config/db.js';

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// POST /api/products - Submit a new product with image
router.post('/products', upload.single('image'), async (req, res) => {
  const { name, price, description } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, description, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // POST /api/products - Submit a new product
// router.post('/products', async (req, res) => {
//   const { name, price, description, image_url } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO products (name, price, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
//       [name, price, description, image_url]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error('Error inserting product:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// GET /api/products - Get all products or filter by search
router.get('/products', async (req, res) => {
  const { search } = req.query;

  try {
    let result;

    if (search) {
      // Step 1: Split the search query into keywords (ignoring short words)
      const keywords = search.toLowerCase().split(' ').filter((word) => word.length > 2);

      // Step 2: If no valid keywords, return all products
      if (keywords.length === 0) {
        result = await pool.query('SELECT * FROM products ORDER BY id DESC');
      } else {
        // Step 3: Build a dynamic query to match products by keywords in name or description
        const conditions = keywords
          .map(
            (keyword) =>
              `LOWER(name) LIKE '%${keyword}%' OR LOWER(description) LIKE '%${keyword}%'`
          )
          .join(' OR ');

        // Step 4: Execute the query
        result = await pool.query(`SELECT * FROM products WHERE ${conditions} ORDER BY id DESC`);
      }
    } else {
      // Get all products if no search term is provided
      result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
