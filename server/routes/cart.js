// Cart routes — reads/writes DynamoDB ShoppingCart table
const express = require('express');
const router = express.Router();
const { GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDocClient, DYNAMO_TABLE } = require('../db');

// GET /api/cart/:customerId — retrieve cart from DynamoDB
router.get('/:customerId', async (req, res) => {
  const customerId = req.params.customerId;
  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID is required.' });
  }

  try {
    const result = await dynamoDocClient.send(
      new GetCommand({
        TableName: DYNAMO_TABLE,
        Key: { customer_id: String(customerId) },
      })
    );

    if (!result.Item) {
      return res.json({ customer_id: String(customerId), items: [] });
    }

    res.json(result.Item);
  } catch (err) {
    console.error('Cart fetch error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve cart.' });
  }
});

// POST /api/cart/:customerId — upsert cart items in DynamoDB
router.post('/:customerId', async (req, res) => {
  const customerId = req.params.customerId;
  const { items } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'Customer ID is required.' });
  }
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Items must be an array.' });
  }

  // Validate each item
  for (const item of items) {
    if (!item.product_id || typeof item.quantity !== 'number' || item.quantity < 0) {
      return res.status(400).json({ error: `Invalid item: product_id and quantity (>= 0) are required.` });
    }
  }

  // Filter out zero-quantity items
  const filteredItems = items.filter((i) => i.quantity > 0);

  try {
    await dynamoDocClient.send(
      new PutCommand({
        TableName: DYNAMO_TABLE,
        Item: {
          customer_id: String(customerId),
          items: filteredItems,
        },
      })
    );

    res.json({ customer_id: String(customerId), items: filteredItems });
  } catch (err) {
    console.error('Cart update error:', err.message);
    res.status(500).json({ error: 'Failed to update cart.' });
  }
});

module.exports = router;
