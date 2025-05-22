
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('express-basic-auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic Auth Middleware for Swagger
const swaggerUser = process.env.SWAGGER_USER || 'admin';
const swaggerPass = process.env.SWAGGER_PASS || 'sandbox123';

app.use(['/api-docs', '/api-docs/*'], basicAuth({
  users: { [swaggerUser]: swaggerPass },
  challenge: true,
  unauthorizedResponse: (req) => req.auth
    ? 'Credentials rejected'
    : 'No credentials provided'
}));

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Financial Testing Sandbox API',
    version: '1.0.0',
    description: 'Interactive API documentation for the Financial Testing Sandbox.',
  },
  servers: [
    {
      url: 'https://sandbox-backend-bernalo.azurewebsites.net',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of test users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
app.get('/users', (req, res) => {
  res.json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' },
  ]);
});

/**
 * @swagger
 * /echo:
 *   post:
 *     summary: Echo back the posted JSON
 *     tags: [Echo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { "API_KEY": "12345" }
 *     responses:
 *       200:
 *         description: Echoed response
 */
app.post('/echo', (req, res) => {
  res.json({ received: req.body });
});

// Catch root requests
app.get('/', (req, res) => {
  res.send('Financial Testing Sandbox Backend API');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
