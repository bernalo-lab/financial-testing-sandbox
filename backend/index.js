
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'sandbox-secret-key';
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DB_NAME = process.env.MONGO_DB_NAME || 'sandboxDB';
const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || 'users';

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
