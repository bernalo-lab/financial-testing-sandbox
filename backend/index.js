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

// Swagger documentation configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '1.0.0',
      description: 'Interactive API documentation for the Financial Testing Sandbox platform.',
      termsOfService: 'https://example.com/terms',
      contact: {
        name: 'Bernalo Lab Support',
        url: 'https://sandbox-frontend-bernalo.azurewebsites.net',
        email: 'support@bernalo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://sandbox-backend-bernalo.azurewebsites.net',
        description: 'Production Server'
      }
    ],
    tags: [
      { name: 'Status', description: 'System status and health checks' },
      { name: 'Users', description: 'User data endpoints' },
      { name: 'Utilities', description: 'General-purpose utility endpoints' }
    ]
  },
  apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: ['./index.js'], // ← Make sure this is correct
});

// Basic Auth for Swagger UI
const swaggerUser = process.env.DOCS_USER || 'admin';
const swaggerPass = process.env.DOCS_PASS || 'password';

app.use(['/api-docs', '/api-docs/*'],
  basicAuth({
    users: { [swaggerUser]: swaggerPass },
    challenge: true
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Backend is healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.status(200).send('Backend API is running');
});

app.get('/api/users', (req, res) => {
  res.json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' }
  ]);
});

app.post('/api/echo', (req, res) => {
  const { message } = req.body;
  res.json({ received: { message } });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;