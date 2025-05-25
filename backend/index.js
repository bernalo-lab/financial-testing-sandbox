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
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Users', description: 'User data endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Utilities', description: 'Utility endpoints' },
    ]
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', authenticateToken, (req, res) => {
  res.json(users.map(({ password, ...rest }) => rest));
});

// Support both POST and GET for /api/login
app.post('/api/login', handleLogin);
app.get('/api/login', (req, res) => {
  // Simulate GET login with query params
  req.body = {
    username: req.query.username,
    password: req.query.password
  };
  handleLogin(req, res);
});

function handleLogin(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
}

// Register new users
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

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

app.get('/', (req, res) => {
  res.send('Welcome to the JWT-Secured Financial Testing Sandbox API');
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
