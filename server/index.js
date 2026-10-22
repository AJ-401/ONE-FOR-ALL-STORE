// Express server entry point
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const catalogRoutes = require('./routes/catalog');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const ordersRoutes = require('./routes/orders');
const customersRoutes = require('./routes/customers');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/catalog', catalogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
