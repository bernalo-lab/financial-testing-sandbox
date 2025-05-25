const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'sandbox-secret-key';
const MONGO_URI = process.env.MONGO_URI || 'your-cosmos-db-connection-string';
const DB_NAME = 'sandboxDB';
const COLLECTION_NAME = 'users';

let db, usersCollection;

MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    usersCollection = db.collection(COLLECTION_NAME);
    console.log('Connected to Azure Cosmos DB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

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

async function handleLogin(req, res) {
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
}

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial Testing Sandbox API',
      version: '2.2.0',
      description: 'JWT-secured API documentation using Azure Cosmos DB for user data',
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

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', authenticateToken, async (req, res) => {
  const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
  res.json(users);
});

app.post('/api/login', handleLogin);

app.get('/api/login', (req, res) => {
  req.body = {
    username: req.query.username,
    password: req.query.password
  };
  handleLogin(req, res);
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await usersCollection.findOne({ username });
  if (exists) return res.status(409).json({ message: 'User already exists' });
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = await usersCollection.insertOne({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully', id: result.insertedId });
});

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

app.get('/', (req, res) => {
  res.send('Welcome to the JWT-Secured Financial Testing Sandbox API with Cosmos DB');
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
