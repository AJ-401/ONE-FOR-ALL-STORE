// Catalog route — reads from RDS MySQL PRODUCTS table
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/catalog — return all products from RDS MySQL
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT product_id, product_name, price, stock FROM PRODUCTS ORDER BY product_id');
    res.json(rows);
  } catch (err) {
    console.error('Catalog fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch product catalog.' });
  }
});

module.exports = router;
