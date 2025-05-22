const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const basicAuth = require("express-basic-auth");

const app = express();
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Financial Testing Sandbox API",
      description: "Interactive documentation for the sandbox testing API",
      version: "1.0.0",
    },
  },
  apis: ["./index.js"], // Adjust if needed
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// ✅ Protect only the raw Swagger JSON spec
app.use(
  "/swagger.json",
  basicAuth({
    users: { admin: "password123" },
    challenge: true,
  }),
  (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  }
);

// ✅ Public Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
app.get("/users", (req, res) => {
  res.json([
    { name: "Alice Tester", role: "QA Engineer" },
    { name: "Bob Developer", role: "Software Engineer" },
  ]);
});

/**
 * @swagger
 * /echo:
 *   post:
 *     summary: Echoes back the request body
 *     tags: [Echo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Echoed response
 */
app.post("/echo", (req, res) => {
  res.json(req.body);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
