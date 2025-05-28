
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const swaggerUi = require('swagger-ui-express');
//const swaggerJsdoc = require('swagger-jsdoc');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'sandbox-secret-key';
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DB_NAME = process.env.MONGO_DB_NAME || 'sandboxDB';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'users';

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (!CONNECTION_STRING) {
  console.error('❌ CONNECTION_STRING is not set.');
  process.exit(1);
}

let db, usersCollection;
MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    usersCollection = db.collection(COLLECTION_NAME);
    console.log('✅ Connected to Azure Cosmos DB');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root path info
 *     tags:
 *       - Utilities
 *     responses:
 *       200:
 *         description: Server is running.
 */

app.get('/', (req, res) => {
  res.send('Welcome to the JWT-Secured Financial Testing Sandbox API with Cosmos DB');
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Returns application health
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: App is healthy
 */

app.get('/health', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Returns backend status
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: OK
 */

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of test users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized
 */

app.get('/api/users', authenticateToken, async (req, res) => {
  const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
  res.json(users);
});

/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Render login form
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Login form HTML
 */

app.get('/api/login', (req, res) => {
  res.send(`
    <form method="POST" action="/api/login">
      <label>Username: <input type="text" name="username" required /></label><br>
      <label>Password: <input type="password" name="password" required /></label><br>
      <input type="submit" value="Login" />
    </form>
  `);
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secure123
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '❌Username and password are required.' });
  }

  try {
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: '❌Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: '❌Invalid username or password.' });
    }

    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: '✅Login successful', token });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: '❌Server error during login.' });
  }
});


/**
 * @swagger
 * /api/register:
 *   get:
 *     summary: Render registration form
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Registration form HTML
 */

app.get('/api/register', (req, res) => {
  res.send(`
    <form method="POST" action="/api/register">
      <label>Username*: <input type="text" name="username" required></label><br>
      <label>Email Address*: <input type="email" name="email" required></label><br>
      <label>Password*: <input type="password" name="password" required></label><br>
      <label>First Name*: <input type="text" name="firstName" required></label><br>
      <label>Middle Name: <input type="text" name="middleName"></label><br>
      <label>Last Name*: <input type="text" name="lastName" required></label><br>
      <label>Job Title*: <input type="text" name="jobTitle" required></label><br>
      <label>Mobile Phone: <input type="text" name="mobile"></label><br>
      <input type="submit" value="Register">
    </form>
  `);
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               mobile:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - jobTitle
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists
 */

app.post('/api/register', async (req, res) => {
  if (!usersCollection) return res.status(500).json({ message: 'Database not initialized' });
  const { username, email, password, firstName, middleName, lastName, jobTitle, mobile } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: '❌Missing required fields.' });
  try {
    const exists = await usersCollection.findOne({ username });
    if (exists) return res.status(409).send('❌User already exists');

    const hashedPassword = bcrypt.hashSync(password, 10);
    await usersCollection.insertOne({ username, email, password: hashedPassword, firstName, middleName, lastName, jobTitle, mobile });
    res.status(201).send('✅Registration successful!');

  } catch (err) {
    console.error('❌ Registration failed:', err.message);
    res.status(500).send('❌Server error during registration.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});


/**
 * @swagger
 * /api/generate-test-cases:
 *   post:
 *     summary: Generate AI-based test scenarios from a given JSON schema
 *     tags:
 *       - AI Testing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schema:
 *                 type: object
 *             example:
 *               schema:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                   currency:
 *                     type: string
 *                 required: [amount, currency]
 *     responses:
 *       200:
 *         description: A list of generated test cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   input:
 *                     type: object
 *                   expected:
 *                     type: object
 */

app.post('/api/generate-test-cases', (req, res) => {
  const { schema } = req.body;

  if (!schema || typeof schema !== 'object') {
    return res.status(400).json({ message: 'Invalid or missing schema object' });
  }

  // Simulate AI + rule logic
  const testCases = [
    {
      input: { amount: 100, currency: 'USD' },
      expected: { status: 'success' }
    },
    {
      input: { amount: 0, currency: 'USD' },
      expected: { status: 'fail', reason: 'Amount must be greater than 0' }
    },
    {
      input: { amount: -50, currency: 'USD' },
      expected: { status: 'fail', reason: 'Negative amount not allowed' }
    },
    {
      input: { amount: 100 },
      expected: { status: 'fail', reason: 'Missing required field: currency' }
    },
    {
      input: { amount: 9999999, currency: 'XYZ' },
      expected: { status: 'warning', reason: 'Unsupported currency code' }
    }
  ];

  res.status(200).json(testCases);
});