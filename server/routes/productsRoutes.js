import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.post('/products', async (req, res) => {
  const { name, price, description, image_url } = req.body;
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

export default router;
