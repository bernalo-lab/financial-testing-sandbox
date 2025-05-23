
const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic Auth Middleware for Swagger docs
const swaggerUser = process.env.DOCS_USER || 'admin';
const swaggerPass = process.env.DOCS_PASS || 'password';

app.use(
  ['/api-docs', '/api-docs/*'],
  basicAuth({
    users: { [swaggerUser]: swaggerPass },
    challenge: true,
  })
);

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Sandbox API',
      version: '1.0.0',
      description: 'Auto-generated Swagger docs for Sandbox APIs',
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
 *     summary: Get backend status
 *     responses:
 *       200:
 *         description: Backend is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Backend is healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     responses:
 *       200:
 *         description: Backend API is running
 */
app.get('/', (req, res) => {
  res.status(200).send('Backend API is running');
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users list
 *     responses:
 *       200:
 *         description: Returns a list of users
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
 * /api/echo:
 *   post:
 *     summary: Echo back the posted JSON
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Echoed message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 */
app.post('/api/echo', (req, res) => {
  const { message } = req.body;
  res.json({ received: { message } });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Status OK
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
