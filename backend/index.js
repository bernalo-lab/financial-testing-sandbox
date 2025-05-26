
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let usersCollection;

async function connectToMongoDB() {
  try {
    const client = new MongoClient(process.env.CONNECTION_STRING);
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME);
    usersCollection = db.collection(process.env.MONGO_COLLECTION_NAME);
    console.log('Connected to Azure Cosmos DB');
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
  }
}

connectToMongoDB();

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
      <label>Mobile Phone: <input type="tel" name="mobile"></label><br>
      <button type="submit">Register</button>
    </form>
  `);
});

app.post('/api/register', async (req, res) => {
  if (!usersCollection) {
    return res.status(500).json({ message: 'Database not initialized' });
  }

  const {
    username, email, password,
    firstName, middleName,
    lastName, jobTitle, mobile
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email, and password are required.' });
  }

  try {
    const exists = await usersCollection.findOne({ username });
    if (exists) return res.status(409).send('User already exists');

    const hashedPassword = bcrypt.hashSync(password, 10);
    await usersCollection.insertOne({
      username,
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

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
