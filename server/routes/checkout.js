// Checkout route — cross-database transaction: RDS MySQL + DynamoDB
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { pool, dynamoDocClient, DYNAMO_TABLE } = require('../db');

// POST /api/checkout — process checkout
router.post('/', async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required.' });
  }

  const customerIdStr = String(customerId);
  const customerIdInt = parseInt(customerId, 10);

  if (isNaN(customerIdInt)) {
    return res.status(400).json({ error: 'customerId must be a valid number.' });
  }

  // Map PRD customer IDs (101: Alice Smith, 102: Bob Jones) to MySQL PKs (1, 2)
  const mysqlCustomerId = (customerIdInt === 101) ? 1 : (customerIdInt === 102) ? 2 : customerIdInt;

  // ─── Step 1: Read cart from DynamoDB ─────────────────────────────────────
  let cartItems;
  try {
    let cartResult = await dynamoDocClient.send(
      new GetCommand({
        TableName: DYNAMO_TABLE,
        Key: { customer_id: customerIdStr },
      })
    );

    // Fallback if cart was stored under mapped MySQL ID
    if ((!cartResult.Item || !cartResult.Item.items || cartResult.Item.items.length === 0) && customerIdStr !== String(mysqlCustomerId)) {
      cartResult = await dynamoDocClient.send(
        new GetCommand({
          TableName: DYNAMO_TABLE,
          Key: { customer_id: String(mysqlCustomerId) },
        })
      );
    }

    if (!cartResult.Item || !cartResult.Item.items || cartResult.Item.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Add items before checkout.' });
    }

    cartItems = cartResult.Item.items;
  } catch (err) {
    console.error('Checkout - cart read error:', err.message);
    return res.status(500).json({ error: 'Failed to read cart from DynamoDB.' });
  }

  // ─── Step 2: MySQL transaction ───────────────────────────────────────────
  const connection = await pool.getConnection();
  let orderId;
  let totalAmount = 0;

  try {
    await connection.beginTransaction();

    // Validate customer exists in RDS MySQL
    const [customers] = await connection.query(
      'SELECT customer_id FROM CUSTOMERS WHERE customer_id = ?',
      [mysqlCustomerId]
    );
    if (customers.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ error: `Customer ${customerIdInt} not found.` });
    }

    // Validate products and calculate totals
    const productIds = cartItems.map((i) => Number(i.product_id) || i.product_id);
    const [products] = await connection.query(
      'SELECT product_id, product_name, price, stock FROM PRODUCTS WHERE product_id IN (?)',
      [productIds]
    );

    const productMap = {};
    for (const p of products) {
      productMap[p.product_id] = p;
    }

    // Check all products exist and have sufficient stock
    for (const item of cartItems) {
      const product = productMap[item.product_id] || productMap[Number(item.product_id)];
      if (!product) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ error: `Product ${item.product_id} not found.` });
      }
      if (product.stock < item.quantity) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          error: `Insufficient stock for "${product.product_name}". Available: ${product.stock}, Requested: ${item.quantity}.`,
        });
      }
      totalAmount += parseFloat(product.price) * item.quantity;
    }

    totalAmount = Math.round(totalAmount * 100) / 100;

    // Generate unique order_id using random int (schema uses INT PK, not auto-increment)
    // Use a random number in a safe range and check for collision
    const generateOrderId = async () => {
      // Use timestamp + random to minimize collisions
      let id;
      let attempts = 0;
      do {
        id = Math.floor(Date.now() % 1000000000) + Math.floor(Math.random() * 10000);
        const [existing] = await connection.query('SELECT order_id FROM ORDERS WHERE order_id = ?', [id]);
        if (existing.length === 0) return id;
        attempts++;
      } while (attempts < 5);
      throw new Error('Failed to generate unique order ID after 5 attempts.');
    };

    orderId = await generateOrderId();

    // Insert order
    await connection.query(
      'INSERT INTO ORDERS (order_id, customer_id, order_date, total_amount, status) VALUES (?, ?, NOW(), ?, ?)',
      [orderId, mysqlCustomerId, totalAmount, 'Processing']
    );

    // Insert order items and decrement stock
    for (const item of cartItems) {
      const product = productMap[item.product_id] || productMap[Number(item.product_id)];
      const unitPrice = parseFloat(product.price);

      // Generate unique order_item_id
      const orderItemId = Math.floor(Date.now() % 1000000000) + Math.floor(Math.random() * 100000);

      await connection.query(
        'INSERT INTO ORDER_ITEMS (order_item_id, order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)',
        [orderItemId, orderId, product.product_id, item.quantity, unitPrice]
      );

      // Conditional stock decrement — re-check stock in update
      const [updateResult] = await connection.query(
        'UPDATE PRODUCTS SET stock = stock - ? WHERE product_id = ? AND stock >= ?',
        [item.quantity, product.product_id, item.quantity]
      );

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          error: `Stock race condition for product ${item.product_id}. Please retry.`,
        });
      }
    }

    // ─── Step 3: Commit MySQL transaction ──────────────────────────────────
    await connection.commit();
    connection.release();
  } catch (err) {
    try {
      await connection.rollback();
    } catch (_) {}
    connection.release();
    console.error('Checkout - MySQL transaction error:', err.message);
    return res.status(500).json({ error: 'Checkout failed. Transaction rolled back.' });
  }

  // ─── Step 4: Clear DynamoDB cart (post-commit) ───────────────────────────
  // MySQL has already committed. Even if this fails, the order was created.
  try {
    await dynamoDocClient.send(
      new DeleteCommand({
        TableName: DYNAMO_TABLE,
        Key: { customer_id: customerIdStr },
      })
    );
    if (customerIdStr !== String(mysqlCustomerId)) {
      await dynamoDocClient.send(
        new DeleteCommand({
          TableName: DYNAMO_TABLE,
          Key: { customer_id: String(mysqlCustomerId) },
        })
      );
    }
  } catch (err) {
    console.error('Checkout - cart clear error (order was created):', err.message);
    // Don't fail the response — order was already created in MySQL.
    return res.status(200).json({
      orderId,
      totalAmount,
      itemCount: cartItems.length,
      warning: 'Order placed successfully but cart could not be cleared. It may still appear until next refresh.',
    });
  }

  res.json({
    orderId,
    totalAmount,
    itemCount: cartItems.length,
    message: 'Order placed successfully!',
  });
});

module.exports = router;
