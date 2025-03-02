// updatePlayerValuesRoutes.js
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const router = express.Router();

let client;
let db;

// Initialize MongoDB connection
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable not set');
  }
  const dbName = 'keeptradecut';
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  try {
    await client.connect();
    console.log('Connected to MongoDB in updatePlayerValuesRoutes');
    db = client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Connect and handle errors
connectToDatabase().catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

router.post('/', async (req, res) => {
  console.log('POST request received on updatePlayerValuesRoutes');
  const { choices, players } = req.body;

  if (!db) {
    console.error('Database connection not established in updatePlayerValuesRoutes');
    return res.status(500).json({ error: 'Database connection not established' });
  }

  const collection = db.collection('nba_players');
  const updates = [];

  try {
    const sortedPlayers = players.sort((a, b) => b.value - a.value);

    for (let i = 0; i < sortedPlayers.length; i++) {
      let valueChange = 0;
      const currentPlayer = sortedPlayers[i];
      const currentChoice = choices[currentPlayer._id];
      const currentRank = ['keep', 'trade', 'cut'].indexOf(currentChoice);

      for (let j = 0; j < sortedPlayers.length; j++) {
        if (i !== j) {
          const otherPlayer = sortedPlayers[j];
          const otherChoice = choices[otherPlayer._id];
          const otherRank = ['keep', 'trade', 'cut'].indexOf(otherChoice);

          if (currentRank < otherRank && currentPlayer.value < otherPlayer.value) {
            valueChange += 13;
          } else if (currentRank > otherRank && currentPlayer.value > otherPlayer.value) {
            valueChange -= 13;
          }
        }
      }

      let newValue = Math.min(Math.max(currentPlayer.value + valueChange, 0), 9999);
      valueChange = newValue - currentPlayer.value;

      if (valueChange !== 0) {
        updates.push({
          updateOne: {
            filter: { _id: new ObjectId(currentPlayer._id) },
            update: { $inc: { value: valueChange } }
          }
        });
      }
    }

    if (updates.length > 0) {
      await collection.bulkWrite(updates);
    }

    console.log('Player values updated successfully');
    res.json({ message: 'Player values updated successfully' });
  } catch (error) {
    console.error('Error updating player values:', error);
    res.status(500).json({ error: 'Error updating player values' });
  }
});

export default router;
