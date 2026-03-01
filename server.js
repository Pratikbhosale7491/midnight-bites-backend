const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Health check endpoint - VERY important for K8s!
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    service: 'midnight-bites-backend',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/menu', require('./src/routes/menu'));
app.use('/api/orders', require('./src/routes/orders'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌙 Midnight Bites Backend running on port ${PORT}`);
});

module.exports = app;