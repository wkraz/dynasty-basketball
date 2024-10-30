import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import * as playerController from '../controllers/playerController.js';

const router = express.Router();

let client;
let db;

// Initialize MongoDB connection
async function connectToDatabase() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Attempting to connect with URI:', uri ? 'URI exists' : 'URI is missing');
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable not set');
    }

    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    console.log('Successfully connected to MongoDB');
    db = client.db('keeptradecut');
    return db;
  } catch (error) {
    console.error('Detailed connection error:', error);
    throw error;
  }
}

// Connect and handle errors
connectToDatabase().catch(error => {
  console.error('Database connection failed:', error);
  process.exit(1);
});

// GET all players
router.get('/', async (req, res) => {
  if (!db) {
    console.error('Database not connected');
    return res.status(500).json({ error: 'Database not connected' });
  }
  
  try {
    const collection = db.collection('nba_players');
    const players = await collection.find({}).toArray();
    console.log(`Found ${players.length} players`); // Debug log
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
