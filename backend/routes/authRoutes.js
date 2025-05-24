const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  return res.status(201).json({ message: `Registered ${email}`, token: 'fake-jwt-token' });
});

module.exports = router;
