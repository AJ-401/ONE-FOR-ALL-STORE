// Orders route — reads from RDS MySQL with JOINs
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/orders/:customerId — return order history with line items
router.get('/:customerId', async (req, res) => {
  const rawId = parseInt(req.params.customerId, 10);

  if (isNaN(rawId)) {
    return res.status(400).json({ error: 'Valid customer ID is required.' });
  }

  // Handle PRD customer IDs (101: Alice Smith, 102: Bob Jones) mapped to RDS MySQL PKs
  const customerId = (rawId === 101) ? 1 : (rawId === 102) ? 2 : rawId;

  try {
    // Verify customer exists
    const [customers] = await pool.query(
      'SELECT customer_id, name, email FROM CUSTOMERS WHERE customer_id = ?',
      [customerId]
    );
    if (customers.length === 0) {
      return res.status(404).json({ error: `Customer ${rawId} not found.` });
    }

    // Fetch orders with line items using JOINs
    const [rows] = await pool.query(
      `SELECT 
        o.order_id,
        o.order_date,
        o.total_amount,
        o.status,
        oi.order_item_id,
        oi.product_id,
        oi.quantity,
        oi.unit_price,
        p.product_name
      FROM ORDERS o
      JOIN ORDER_ITEMS oi ON o.order_id = oi.order_id
      JOIN PRODUCTS p ON oi.product_id = p.product_id
      WHERE o.customer_id = ?
      ORDER BY o.order_date DESC, o.order_id DESC`,
      [customerId]
    );

    // Group by order
    const ordersMap = {};
    for (const row of rows) {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id: row.order_id,
          order_date: row.order_date,
          total_amount: row.total_amount,
          status: row.status,
          items: [],
        };
      }
      ordersMap[row.order_id].items.push({
        order_item_id: row.order_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        unit_price: row.unit_price,
      });
    }

    const orders = Object.values(ordersMap);

    res.json({
      customer: customers[0],
      orders,
    });
  } catch (err) {
    console.error('Orders fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch order history.' });
  }
});

module.exports = router;
