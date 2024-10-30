import fs from 'fs';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use environment variable for MongoDB URI
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable not set');
}
const dbName = 'keeptradecut';

// Read JSON file
const rawdata = fs.readFileSync(join(__dirname, 'nba_players.json'));
const players = JSON.parse(rawdata);

async function importData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('nba_players');

    // Insert the documents
    const result = await collection.insertMany(players);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

// Run with environment variables
import dotenv from 'dotenv';
dotenv.config();

importData();
