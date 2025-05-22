const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const auth = require('basic-auth');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'https://sandbox-frontend-bernalo.azurewebsites.net',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(bodyParser.json());

// Swagger Auth Middleware
const swaggerAuth = (req, res, next) => {
  const user = auth(req);
  const username = process.env.SWAGGER_USER || 'admin';
  const password = process.env.SWAGGER_PASS || 'sandbox123';

  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm="Swagger Docs"');
    return res.status(401).send('Authentication required.');
  }
  next();
};

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '1.0.0',
      description: 'An enterprise-grade backend testing interface for financial and QA engineering teams.',
      termsOfService: 'https://bernalo.com/terms',
      contact: {
        name: 'Bernalo Lab',
        url: 'https://bernalo.com',
        email: 'support@bernalo.com'
      },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key must be provided in the request header'
        }
      }
    },
    security: [{
      ApiKeyAuth: []
    }]
  },
  apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is alive
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * @openapi
 * /api/status:
 *   get:
 *     summary: Backend service status
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Returns backend status message
 */
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running smoothly!' });
});

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get a list of mock users
 *     tags:
 *       - Users
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
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Ada Lovelace
 *                   role:
 *                     type: string
 *                     example: QA Engineer
 */
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Ada Lovelace', role: 'QA Engineer' },
    { id: 2, name: 'Grace Hopper', role: 'DevOps Engineer' },
    { id: 3, name: 'Alan Turing', role: 'Developer' }
  ]);
});

/**
 * @openapi
 * /api/echo:
 *   post:
 *     summary: Echoes back the input JSON
 *     tags:
 *       - Utilities
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Hello, world!
 *     responses:
 *       200:
 *         description: Echoed back input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 echoed:
 *                   type: string
 *                   example: Hello, world!
 */
app.post('/api/echo', (req, res) => {
  const { message } = req.body;
  res.json({ echoed: message });
});

app.get('/', (req, res) => {
  res.send('✅ Sandbox backend is running. Visit /api-docs for Swagger UI.');
});

app.listen(port, () => {
  console.log(`Sandbox backend listening on port ${port}`);
});