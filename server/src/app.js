const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

