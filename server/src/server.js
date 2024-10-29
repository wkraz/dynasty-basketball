import express from 'express';
import http from 'http';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import playerRoutes from './routes/playerRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import updatePlayerValuesRoutes from './routes/updatePlayerValuesRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://chooseyourhooper.com']  
    : ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(cors(corsOptions));
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
    
    const db = client.db('keeptradecut');
    app.locals.db = db;

    // Routes
    app.use('/api/players', playerRoutes);
    app.use('/api/trades', tradeRoutes);
    app.use('/api/update-player-values', updatePlayerValuesRoutes);

    // Basic route for the root path
    app.get('/', (req, res) => {
      res.send('Hello from the server!');
    });

    // Catch-all route for debugging
    app.use('*', (req, res) => {
      // console.log(`No route found for ${req.method} ${req.url}`);
      res.status(404).send('Not Found');
    });

    const server = http.createServer(app);

    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    server.on('error', onError);
    server.on('listening', onListening);

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

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
  // console.log('Listening on ' + bind);
}

// Start the server
connectDB().catch(console.dir);
