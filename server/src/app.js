import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { MongoClient } from 'mongodb';

import playerRoutes from './routes/playerRoutes.js';
import rankingsRoutes from './routes/rankingsRoutes.js';
import tradeCalculatorRoutes from './routes/tradeCalculatorRoutes.js';
import updatePlayerValuesRoutes from './routes/updatePlayerValuesRoutes.js';

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3001', // This should match your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'keeptradecut';

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    app.locals.db = db;

    // Routes
    app.use('/api/players', playerRoutes);
    app.use('/api/rankings', rankingsRoutes);
    app.use('/api/trade-calculator', tradeCalculatorRoutes);
    app.use('/api/update-player-values', updatePlayerValuesRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });



// Catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`No route found for ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});



export default app;
