const fs = require('fs');
const { MongoClient } = require('mongodb');

// Connection URL for local MongoDB
const url = 'mongodb://localhost:27017';
const dbName = 'keeptradecut';

// Read JSON file
const rawdata = fs.readFileSync('nba_players.json');
const players = JSON.parse(rawdata);

async function importData() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('nba_players');

    // Insert the documents
    const result = await collection.insertMany(players);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

importData();
