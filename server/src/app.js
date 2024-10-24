import express from 'express';
import morgan from 'morgan';
import { MongoClient } from 'mongodb';

import playerRoutes from './routes/playerRoutes.js';
import rankingsRoutes from './routes/rankingsRoutes.js';
import tradeCalculatorRoutes from './routes/tradeCalculatorRoutes.js';
import updatePlayerValuesRoutes from './routes/updatePlayerValuesRoutes.js';

const app = express();

// CORS configuration
// app.use(cors({
//   origin: 'http://localhost:3001', // Explicitly allow your React app's origin
//   credentials: true, // Allow credentials (cookies, authorization headers)
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
// }));

app.use(morgan('dev'));
app.use(express.json());

// MongoDB connection
const url = 'mongodb://localhost:27017';
const dbName = 'keeptradecut';

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    app.locals.db = db;
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/rankings', rankingsRoutes);
app.use('/api/trade-calculator', tradeCalculatorRoutes);
app.use('/api/update-player-values', updatePlayerValuesRoutes);

// Add this general OPTIONS handler
app.options('*', cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
