const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Import the /auth routes
const authRoutes = require('./authRoutes');
app.use('/auth', authRoutes);

// Swagger configuration
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '1.0.0',
      description: 'Interactive API documentation for the Financial Testing Sandbox platform.',
      contact: {
        name: 'Bernalo Lab Support',
        url: 'https://bernalo.com',
        email: 'support@bernalo.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://sandbox-backend-bernalo.azurewebsites.net',
        description: 'Production Server',
      },
    ],
  },
  apis: ['./index.js'],
});

// Swagger UI with basic auth
const swaggerAuth = basicAuth({
  users: { [process.env.DOCS_USER]: process.env.DOCS_PASS },
  challenge: true,
});

app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.status(200).send('OK'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  res.status(200).json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' },
  ]);
});

app.post('/api/echo', (req, res) => {
  res.status(200).json({ received: req.body });
});

app.listen(PORT, () => console.log(`Sandbox backend running on port ${PORT}`));
