import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

import playerRoutes from './routes/playerRoutes.js';
import rankingsRoutes from './routes/rankingsRoutes.js';
import tradeCalculatorRoutes from './routes/tradeCalculatorRoutes.js';
import updatePlayerValuesRoutes from './routes/updatePlayerValuesRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['your-production-domain.com'] // TODO - change this to the production domain
    : ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    // console.log('Connected to MongoDB Atlas');
    
    const db = client.db('keeptradecut'); // Your database name
    app.locals.db = db;

    // Routes
    app.use('/api/players', playerRoutes);
    app.use('/api/rankings', rankingsRoutes);
    app.use('/api/trade-calculator', tradeCalculatorRoutes);
    app.use('/api/update-player-values', updatePlayerValuesRoutes);

    // Catch-all route for debugging
    app.use('*', (req, res) => {
      // console.log(`No route found for ${req.method} ${req.url}`);
      res.status(404).send('Not Found');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

connectDB().catch(console.dir);

export default app;
