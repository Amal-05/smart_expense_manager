const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// Register User
router.post('/register', async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const stmt = db.prepare(`INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)`);
    stmt.run([username, email, phone, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username or Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      // Generate token
      const token = jwt.sign(
        { user_id: this.lastID, username, email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({ message: 'User created successfully', token });
    });
    stmt.finalize();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login User
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid Credentials' });

    const token = jwt.sign(
      { user_id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Logged in successfully', token });
  });
});

module.exports = router;
