
require('dotenv').config();
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Financial Testing Sandbox API',
    version: '1.0.0',
    description: 'Interactive API documentation for the Financial Testing Sandbox.',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

// Basic Auth Middleware for Swagger UI
const docsUser = process.env.DOCS_USER || 'admin';
const docsPass = process.env.DOCS_PASS || 'password';

app.use(['/api-docs', '/api-docs/*'],
  basicAuth({
    users: { [docsUser]: docsPass },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get('/', (req, res) => {
  res.send('Welcome to the Financial Testing Sandbox Backend!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of user names
 */
app.get('/api/users', (req, res) => {
  res.json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' }
  ]);
});

/**
 * @swagger
 * /api/echo:
 *   post:
 *     summary: Echoes back received data
 *     tags: [Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Echoed data
 */
app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get backend service status
 *     tags: [Utilities]
 *     responses:
 *       200:
 *         description: Current backend status
 */
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
