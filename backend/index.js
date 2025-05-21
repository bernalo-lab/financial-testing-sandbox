const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'https://sandbox-frontend-bernalo.azurewebsites.net',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(bodyParser.json());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sandbox Backend API',
      version: '1.0.0',
      description: 'Auto-generated Swagger docs for sandbox endpoints.'
    }
  },
  apis: ['./index.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is alive
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * @openapi
 * /api/echo:
 *   post:
 *     summary: Echoes back the JSON payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               message: Hello world
 *     responses:
 *       200:
 *         description: Echoed back JSON
 */
app.post('/api/echo', (req, res) => {
  res.json({ echoed: req.body });
});

/**
 * @openapi
 * /api/status:
 *   get:
 *     summary: Returns backend service status
 *     responses:
 *       200:
 *         description: Returns a status message
 */
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running smoothly!' });
});

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Returns list of mock users
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 */
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice Tester', role: 'QA Engineer' },
    { id: 2, name: 'Bob Developer', role: 'Software Engineer' },
    { id: 3, name: 'Eve Analyst', role: 'Business Analyst' }
  ]);
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('✅ Sandbox backend is running. Visit /api-docs for Swagger UI.');
});

// Start server
app.listen(port, () => {
  console.log(`Sandbox backend listening on port ${port}`);
});