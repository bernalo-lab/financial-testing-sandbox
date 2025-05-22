
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('express-basic-auth');

const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '1.0.0',
      description: 'Interactive documentation for sandbox backend API',
    },
    servers: [
      {
        url: 'https://sandbox-backend-bernalo.azurewebsites.net',
      },
    ],
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Basic Auth for Swagger
const swaggerAuth = basicAuth({
  users: { 'admin': 'password123' },
  challenge: true,
});

// Routes
app.use('/swagger.json', swaggerAuth, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of user objects
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
 *     summary: Echoes back posted JSON
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Echoed response
 */
app.post('/echo', (req, res) => {
  res.json(req.body);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Application status
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
