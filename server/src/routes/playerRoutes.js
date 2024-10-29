import express from 'express';
import { MongoClient } from 'mongodb';
import * as playerController from '../controllers/playerController.js';

const router = express.Router();

let client;
let db;

// Initialize MongoDB connection
async function connectToDatabase() {
  const url = 'mongodb://localhost:27017';
  const dbName = 'keeptradecut';
  client = new MongoClient(url);
  
  try {
    await client.connect();
    // console.log('Connected to MongoDB');
    db = client.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

connectToDatabase();

// GET all players
router.get('/', async (req, res) => {
  try {
    const collection = db.collection('nba_players');
    const players = await collection.find({}).toArray();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// GET a single player by ID
router.get('/:id', playerController.getPlayerById);

// POST create a new player
router.post('/', playerController.createPlayer);

// PUT update a player
router.put('/:id', playerController.updatePlayer);

// DELETE a player
router.delete('/:id', playerController.deletePlayer);

export default router;
