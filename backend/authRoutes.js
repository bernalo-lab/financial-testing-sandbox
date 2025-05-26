// authRoutes.js

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await req.users.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
