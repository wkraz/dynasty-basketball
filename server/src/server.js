import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import playerRoutes from './routes/playerRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import updatePlayerValuesRoutes from './routes/updatePlayerValuesRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

// Environment logging
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - moved before app creation
const corsOptions = {
  origin: 'https://chooseyourhooper.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Add CORS headers manually for preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection with retry logic
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('keeptradecut');
    
    // Test the connection
    const collection = db.collection('nba_players');
    const count = await collection.countDocuments();
    console.log(`Database connected with ${count} players`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
}
connectDB();

// After successful MongoDB connection
app.set('db', db);

// Add this before your other routes
app.get('/', (req, res) => {
  res.json({ message: 'Dynasty Basketball API is running' });
});

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/update-player-values', updatePlayerValuesRoutes);
app.use('/api/stats', statsRoutes);

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Create HTTP server
const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

// Add error handling
server.on('error', onError);
server.on('listening', onListening);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

