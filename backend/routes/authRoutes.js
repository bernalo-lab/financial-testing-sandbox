const express = require('express');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Simulate token generation
  const token = Buffer.from(email).toString('base64');
  return res.status(201).json({ message: 'User registered', token });
});

module.exports = router;
