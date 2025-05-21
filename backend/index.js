const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://sandbox-frontend-bernalo.azurewebsites.net',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(bodyParser.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     EchoRequest:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     EchoResponse:
 *       type: object
 *       properties:
 *         echoed:
 *           type: string
 */

/**
 * @swagger
 * /api/echo:
 *   post:
 *     summary: Echoes back the message sent in the request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EchoRequest'
 *     responses:
 *       200:
 *         description: Successful echo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EchoResponse'
 */
app.post('/api/echo', (req, res) => {
  const { message } = req.body;
  res.json({ echoed: message });
});

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Check backend status
 *     responses:
 *       200:
 *         description: Backend status
 */
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running smoothly!' });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List sample users
 *     responses:
 *       200:
 *         description: An array of user objects
 */
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice Tester', role: 'QA Engineer' },
    { id: 2, name: 'Bob Developer', role: 'Software Engineer' },
    { id: 3, name: 'Eve Analyst', role: 'Business Analyst' }
  ]);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Health info
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Financial Sandbox API',
      version: '1.0.0',
      description: 'Interactive API documentation for the sandbox backend.'
    },
    servers: [
      {
        url: 'https://sandbox-backend-bernalo.azurewebsites.net',
        description: 'Production'
      }
    ]
  },
  apis: ['./index.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('✅ Backend is running. Use /api/status, /api/users or /api-docs');
});

app.listen(port, () => {
  console.log(`📚 API docs live at http://localhost:${port}/api-docs`);
});
