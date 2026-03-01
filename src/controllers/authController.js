const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res) => {
  const { email, password, phone, hostel_block } = req.body;

  if (!email || !password || !phone || !hostel_block) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?', [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (email, password, phone, hostel_block) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, phone, hostel_block]
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ 
      message: 'Registered successfully!',
      token,
      user: { id: result.insertId, email, phone, hostel_block }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ 
      message: 'Login successful!',
      token,
      user: { id: user.id, email: user.email, hostel_block: user.hostel_block }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { register, login };