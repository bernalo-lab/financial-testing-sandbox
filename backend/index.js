const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the frontend
app.use(cors({
  origin: 'https://sandbox-frontend-bernalo.azurewebsites.net',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(bodyParser.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Echo route
app.post('/api/echo', (req, res) => {
  const { message } = req.body;
  res.json({ echoed: message });
});

// Status route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running smoothly!' });
});

// Users mock route
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice Tester', role: 'QA Engineer' },
    { id: 2, name: 'Bob Developer', role: 'Software Engineer' },
    { id: 3, name: 'Eve Analyst', role: 'Business Analyst' }
  ]);
});

app.listen(port, () => {
  console.log(`Sandbox backend listening on port ${port}`);
});
