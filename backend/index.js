const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '1.1.0',
      description: 'Expanded API documentation for the Financial Testing Sandbox',
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Users', description: 'User data endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Documents', description: 'Document management endpoints' },
      { name: 'Utilities', description: 'Utility endpoints' },
    ]
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Check the backend health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 */
app.get('/api/users', (req, res) => {
  res.json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' },
  ]);
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Simulate a login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
app.post('/api/login', (req, res) => {
  res.json({ message: 'Login successful', user: req.body.username });
});

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Simulate a logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Retrieve all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: A list of documents
 */
app.get('/api/documents', (req, res) => {
  res.json([{ id: 1, title: 'Test Plan' }, { id: 2, title: 'Bug Report' }]);
});

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Retrieve a specific document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A document
 *       404:
 *         description: Document not found
 */
app.get('/api/documents/:id', (req, res) => {
  const docs = { 1: 'Test Plan', 2: 'Bug Report' };
  const doc = docs[req.params.id];
  if (doc) res.json({ id: req.params.id, title: doc });
  else res.status(404).json({ message: 'Document not found' });
});

/**
 * @swagger
 * /api/echo:
 *   post:
 *     summary: Echo back posted data
 *     tags: [Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Returns posted data
 */
app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

app.get('/api', (req, res) => {
  res.send('API is available. Try /api/status or /api/users');
});

app.get('/', (req, res) => {
  res.send('Welcome to the Financial Testing Sandbox API');
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
