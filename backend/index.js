const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('basic-auth');

// Load environment variables with fallback logging
try {
  require('dotenv').config();
  console.log('✅ dotenv loaded successfully');
} catch (error) {
  console.error('❌ Failed to load dotenv:', error);
}

const app = express();
app.use(bodyParser.json());

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

// Basic Auth middleware for Swagger
app.use('/api-docs', (req, res, next) => {
  const user = basicAuth(req);
  const username = process.env.DOCS_USER || 'admin';
  const password = process.env.DOCS_PASS || 'sandbox123';

  console.log('DOCS_USER:', process.env.DOCS_USER);
  console.log('DOCS_PASS:', process.env.DOCS_PASS);

  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm="Swagger UI"');
    return res.status(401).send('Authentication required.');
  }
  next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/api/users', (req, res) => {
  res.json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' }
  ]);
});

app.post('/api/echo', (req, res) => {
  res.json({ echoed: req.body });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('Financial Testing Sandbox is live. Visit /api-docs for API documentation.');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});