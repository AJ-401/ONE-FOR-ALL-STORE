// Customers route — manages customer profiles in RDS MySQL
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/customers — list all customer profiles
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT customer_id, name, email, phone FROM CUSTOMERS ORDER BY customer_id'
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch customers error:', err.message);
    res.status(500).json({ error: 'Failed to fetch customer accounts.' });
  }
});

// POST /api/customers — create a new customer profile
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Customer name is required.' });
  }

  // Schema limits: name: varchar(20), email: varchar(20), phone: varchar(13)
  const cleanName = name.trim().slice(0, 20);
  const cleanEmail = (email && typeof email === 'string') ? email.trim().slice(0, 20) : 'user@test.com';
  const cleanPhone = (phone && typeof phone === 'string') ? phone.trim().slice(0, 13) : '555-010-0000';

  try {
    // Generate next customer_id
    const [maxRows] = await pool.query('SELECT COALESCE(MAX(customer_id), 0) AS maxId FROM CUSTOMERS');
    const nextId = (maxRows[0].maxId || 0) + 1;

    await pool.query(
      'INSERT INTO CUSTOMERS (customer_id, name, email, phone) VALUES (?, ?, ?, ?)',
      [nextId, cleanName, cleanEmail, cleanPhone]
    );

    res.status(201).json({
      customer_id: nextId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: `Customer account "${cleanName}" created successfully!`,
    });
  } catch (err) {
    console.error('Create customer error:', err.message);
    res.status(500).json({ error: 'Failed to create customer account.' });
  }
});

module.exports = router;
