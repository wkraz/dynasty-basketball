import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { MongoClient } from 'mongodb';

import playerRoutes from './routes/playerRoutes.js';
import rankingsRoutes from './routes/rankingsRoutes.js';
import tradeCalculatorRoutes from './routes/tradeCalculatorRoutes.js';

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

app.use('/api/players', playerRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/trade-calculator', tradeCalculatorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
