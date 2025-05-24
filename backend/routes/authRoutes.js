const express = require('express');
const router = express.Router();

// Dummy in-memory store for demo
const registeredUsers = new Map();

// Register and issue token
router.post('/register', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const token = Math.random().toString(36).substring(2);
  registeredUsers.set(token, email);
  res.status(200).json({ message: 'Registered successfully', token });
});

// Verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (registeredUsers.has(token)) {
    res.json({ verified: true, email: registeredUsers.get(token) });
  } else {
    res.status(401).json({ verified: false });
  }
});

module.exports = router;
