const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware
app.use(helmet()); // Helps secure your app by setting various HTTP headers
app.use(cors()); // Enables CORS for all routes
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Fantasy Basketball Helper API' });
});

// Player routes (placeholder)
const playerRoutes = require('./routes/playerRoutes');
app.use('/api/players', playerRoutes);

// Rankings routes (placeholder)
const rankingsRoutes = require('./routes/rankingsRoutes');
app.use('/api/rankings', rankingsRoutes);

// Trade calculator routes (placeholder)
const tradeCalculatorRoutes = require('./routes/tradeCalculatorRoutes');
app.use('/api/trade-calculator', tradeCalculatorRoutes);

app.get('/api/players', async (req, res) => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'keeptradecut';
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('nba_players');
    
    const players = await collection.find({}).toArray();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
