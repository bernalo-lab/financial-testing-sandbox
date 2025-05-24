
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const USERS_DB = {}; // For demo only. Replace with DB.

router.post('/register', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'sandbox-secret', { expiresIn: '2h' });
  USERS_DB[username] = token;

  res.status(201).json({ username, token });
});

router.post('/verify', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sandbox-secret');
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
});

module.exports = router;
