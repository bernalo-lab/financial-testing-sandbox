
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (!process.env.CONNECTION_STRING) {
  console.error('❌ Error: CONNECTION_STRING environment variable is not set.');
  process.exit(1);
}

const client = new MongoClient(process.env.CONNECTION_STRING);
let usersCollection;

async function initializeDbConnection() {
  try {
    await client.connect();
    const database = client.db(process.env.MONGO_DB_NAME);
    usersCollection = database.collection(process.env.MONGO_COLLECTION_NAME);
    console.log('✅ Connected to Azure Cosmos DB');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
}

initializeDbConnection();

app.post('/api/register', async (req, res) => {
  if (!usersCollection) {
    return res.status(500).json({ message: 'Database not initialized' });
  }

  const { firstName, middleName, lastName, jobTitle, email, mobilePhone } = req.body;

  try {
    const exists = await usersCollection.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const result = await usersCollection.insertOne({
      firstName,
      middleName,
      lastName,
      jobTitle,
      email,
      mobilePhone,
    });

    res.status(201).json({ message: 'Registration successful', id: result.insertedId });
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    res.status(500).json({ message: 'Registration failed due to a server error.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
});
