const express = require("express");
const app = express();
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// CORS setup
app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Sandbox API",
      version: "1.0.0",
      description: "API documentation for the Financial Testing Sandbox",
      contact: {
        name: "Bernalo Lab",
        url: "https://sandbox-frontend-bernalo.azurewebsites.net/"
      },
    },
    servers: [{ url: "https://sandbox-backend-bernalo.azurewebsites.net" }]
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 */
app.get("/api/users", (req, res) => {
  const users = [
    { name: "Alice Tester", role: "QA Engineer" },
    { name: "Bob Developer", role: "Software Engineer" },
    { name: "Eve Analyst", role: "Business Analyst" },
  ];
  res.json(users);
});

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Returns the status of the backend
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service status and uptime.
 */
app.get("/api/status", (req, res) => {
  res.json({
    status: "Backend is healthy",
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome route
 *     tags: [Welcome]
 *     responses:
 *       200:
 *         description: Welcome message.
 */
app.get("/", (req, res) => {
  res.send("Welcome to the Financial Testing Sandbox API!");
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is healthy.
 */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
