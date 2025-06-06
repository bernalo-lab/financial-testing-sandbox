const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'sandbox-secret-key';
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DB_NAME = process.env.MONGO_DB_NAME || 'sandboxDB';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'users';

// Serve Swagger UI from static swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
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

app.get('/', (req, res) => {
  res.send('Welcome to the JWT-Secured Financial Testing Sandbox API with Cosmos DB');
});

app.get('/health', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', authenticateToken, async (req, res) => {
  const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
  res.json(users);
});

app.get('/api/login', (req, res) => {
  res.send(\`
    <form method="POST" action="/api/login">
      <label>Username: <input type="text" name="username" required /></label><br>
      <label>Password: <input type="password" name="password" required /></label><br>
      <input type="submit" value="Login" />
    </form>
  \`);
});

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
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: '✅Login successful', token });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

app.get('/api/register', (req, res) => {
  res.send(\`
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
  \`);
});

app.post('/api/register', async (req, res) => {
  if (!usersCollection) return res.status(500).json({ message: 'Database not initialized' });
  const { username, email, password, firstName, middleName, lastName, jobTitle, mobile } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Missing required fields.' });

  try {
    const exists = await usersCollection.findOne({ username });
    if (exists) return res.status(409).send('User already exists');

    const hashedPassword = bcrypt.hashSync(password, 10);
    await usersCollection.insertOne({ username, email, password: hashedPassword, firstName, middleName, lastName, jobTitle, mobile });
    res.status(201).send('✅Registration successful!');
  } catch (err) {
    console.error('❌ Registration failed:', err.message);
    res.status(500).send('Server error during registration.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});