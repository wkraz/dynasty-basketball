import express from 'express';
import http from 'http';
import playerRoutes from './routes/playerRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// Middleware
app.use(express.json());

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/trades', tradeRoutes);

app.get('/api/players', (req, res) => {
  res.json({ message: 'This will return player data in the future' });
});

app.get('/api/trades', (req, res) => {
  res.json({ message: 'This will return trade data in the future' });
});

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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

// You can now use exampleSharedFunction in your server code
// exampleSharedFunction();

// Basic route for the root path
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});
