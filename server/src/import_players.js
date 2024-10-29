const fs = require('fs');
const { MongoClient } = require('mongodb');

// Connection URL for local MongoDB
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable not set');
}
const dbName = 'keeptradecut';

// Read JSON file
const rawdata = fs.readFileSync('nba_players.json');
const players = JSON.parse(rawdata);

async function importData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    //console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('nba_players');

    // Insert the documents
    const result = await collection.insertMany(players);
    // console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

importData();
