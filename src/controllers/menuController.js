const pool = require('../config/database');

const getMenuItems = async (req, res) => {
  try {
    const [items] = await pool.execute(
      'SELECT * FROM menu_items WHERE is_available = 1 ORDER BY category, name'
    );
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch menu' });
  }
};

module.exports = { getMenuItems };