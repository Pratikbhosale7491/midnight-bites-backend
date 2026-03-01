const pool = require('../config/database');

const placeOrder = async (req, res) => {
  const { items, delivery_time, payment_method, total_amount } = req.body;
  const userId = req.user.id;

  if (!items || !delivery_time || !payment_method || !total_amount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const orderId = 'MB' + Date.now();

    const [result] = await pool.execute(
      `INSERT INTO orders 
       (order_id, user_id, items, delivery_time, payment_method, total_amount, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'confirmed')`,
      [orderId, userId, JSON.stringify(items), delivery_time, payment_method, total_amount]
    );

    res.status(201).json({
      message: 'Order placed successfully!',
      order_id: orderId,
      delivery_time,
      status: 'confirmed'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place order' });
  }
};

const getOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

module.exports = { placeOrder, getOrders };
 