const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'sandbox-secret-key';

let users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('password123', 10) },
];

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '2.1.0',
      description: 'JWT-secured API documentation for the Financial Testing Sandbox',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Health' },
      { name: 'Users' },
      { name: 'Auth' },
      { name: 'Utilities' }
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
 *     tags: [Health]
 *     summary: Check backend health status
 *     responses:
 *       200:
 *         description: Server is healthy
 */
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get list of users (JWT required)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users (excluding passwords)
 */
app.get('/api/users', authenticateToken, (req, res) => {
  res.json(users.map(({ password, ...rest }) => rest));
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with username and password (POST)
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
 *         description: JWT token
 */
app.post('/api/login', handleLogin);

/**
 * @swagger
 * /api/login:
 *   get:
 *     tags: [Auth]
 *     summary: Login with username and password via query params (GET)
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
app.get('/api/login', (req, res) => {
  req.body = {
    username: req.query.username,
    password: req.query.password
  };
  handleLogin(req, res);
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
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
 *       201:
 *         description: User registered successfully
 */
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const id = users.length + 1;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ id, username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully', id });
});

/**
 * @swagger
 * /api/echo:
 *   post:
 *     tags: [Utilities]
 *     summary: Echo back JSON data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Echoed back input
 */
app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Root welcome endpoint
 *     responses:
 *       200:
 *         description: Welcome message
 */
app.get('/', (req, res) => {
  res.send('Welcome to the JWT-Secured Financial Testing Sandbox API');
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
