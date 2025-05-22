
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Enable CORS for frontend domain
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://sandbox-frontend-bernalo.azurewebsites.net',
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Financial Testing Sandbox Backend!');
});

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  res.json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' }
  ]);
});

app.post('/api/echo', (req, res) => {
  res.json(req.body);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
