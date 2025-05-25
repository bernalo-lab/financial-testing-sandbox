
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '.env.example' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
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
  if (!usersCollection) {
    return res.status(500).json({ message: 'Database not initialized' });
  }
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
}

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

app.post('/api/login', handleLogin);

app.get('/api/login', (req, res) => {
  req.body = {
    username: req.query.username,
    password: req.query.password
  };
  handleLogin(req, res);
});

app.get('/api/register', (req, res) => {
  res.send(`
    <h1>Registration Form</h1>
    <form method="POST" action="/api/register">
      <label>First Name*: <input type="text" name="firstName" required></label><br>
      <label>Middle Name: <input type="text" name="middleName"></label><br>
      <label>Last Name*: <input type="text" name="lastName" required></label><br>
      <label>Job Title*: <input type="text" name="jobTitle" required></label><br>
      <label>Email Address*: <input type="email" name="email" required></label><br>
      <label>Mobile Phone: <input type="text" name="mobile"></label><br>
      <label>Password*: <input type="password" name="password" required></label><br>
      <input type="submit" value="Register">
    </form>
  `);
});

app.post('/api/register', async (req, res) => {
  if (!usersCollection) {
    return res.status(500).json({ message: 'Database not initialized' });
  }

  const { email, password, firstName, middleName, lastName, jobTitle, mobile } = req.body;

  try {
    const exists = await usersCollection.findOne({ email });
    if (exists) return res.status(409).send('User already exists');

    const hashedPassword = bcrypt.hashSync(password, 10);
    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      firstName,
      middleName,
      lastName,
      jobTitle,
      mobile
    });

    res.send('Registration successful!');
  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).send('Registration failed due to a server error.');
  }
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
