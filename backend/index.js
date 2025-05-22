
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
      description: 'API documentation for the Financial Testing Sandbox',
    },
    servers: [
      {
        url: 'https://sandbox-backend-bernalo.azurewebsites.net',
      },
    ],
  },
  apis: ['./index.js'], // adjust if your file is named differently
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware: Swagger JSON protected with basic auth
const swaggerAuth = basicAuth({
  users: { 'admin': 'password123' },
  challenge: true,
});

app.use('/swagger.json', swaggerAuth, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Middleware: Protect Swagger UI route
app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/users', (req, res) => {
  res.json([
    { name: 'Alice Tester', role: 'QA Engineer' },
    { name: 'Bob Developer', role: 'Software Engineer' },
    { name: 'Eve Analyst', role: 'Business Analyst' },
  ]);
});

app.post('/echo', (req, res) => {
  res.json(req.body);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
