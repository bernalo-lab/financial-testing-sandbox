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
      version: '1.0.0',
      description: 'API documentation for the Financial Testing Sandbox',
    },
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

app.get('/api', (req, res) => {
  res.send('API is available. Try /api/status or /api/users');
});

app.get('/', (req, res) => {
  res.send('Welcome to the Financial Testing Sandbox API');
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
