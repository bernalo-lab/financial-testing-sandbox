const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const basicAuth = require('express-basic-auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./authRoutes');
app.use('/auth', authRoutes);

// Example endpoints
app.get('/', (req, res) => {
  res.send('Welcome to the Financial Testing Sandbox API');
});

app.get('/health', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '1.0.0',
      description: 'Interactive API documentation for the Financial Testing Sandbox platform.',
      contact: {
        name: 'Bernalo Lab Support',
        url: 'https://www.bernalo.com',
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
    ]
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Optional basic auth protection for Swagger UI
if (process.env.DOCS_USER && process.env.DOCS_PASS) {
  app.use(['/api-docs', '/api-docs/*'], basicAuth({
    users: { [process.env.DOCS_USER]: process.env.DOCS_PASS },
    challenge: true
  }));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
