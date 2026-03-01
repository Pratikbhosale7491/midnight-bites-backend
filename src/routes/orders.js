const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, placeOrder);
router.get('/my-orders', authMiddleware, getOrders);

module.exports = router;