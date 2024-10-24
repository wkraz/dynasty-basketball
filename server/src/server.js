import express from 'express';
import http from 'http';
import cors from 'cors';
import playerRoutes from './routes/playerRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import updatePlayerValuesRoutes from './routes/updatePlayerValuesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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
  console.log(`No route found for ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
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
