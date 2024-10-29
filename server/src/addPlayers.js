const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/keeptradecut', { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected successfully to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// Define your Player model
const PlayerSchema = new mongoose.Schema({
  name: String,
  team: String,
  position: String,
  height: String,
  weight: Number,
  birthday: Date,
  value: Number,
});

const Player = mongoose.model('Player', PlayerSchema);

const addPlayers = async () => {
  try {
    const filePath = path.join(__dirname, 'nba_players.json');
    const data = await fs.readFile(filePath, 'utf8');
    const players = JSON.parse(data);

    for (let playerData of players) {
      const player = {
        ...playerData,
        value: 5000 // Placeholder value
      };

      const existingPlayer = await Player.findOne({ name: player.name });

      if (existingPlayer) {
        await Player.updateOne({ name: player.name }, player);
        // console.log(`Updated player: ${player.name}`);
      } else {
        const newPlayer = new Player(player);
        await newPlayer.save();
        // console.log(`Added new player: ${player.name}`);
      }
    }

    // console.log('All players have been processed.');
  } catch (error) {
    console.error('Error processing players:', error);
  } finally {
    await mongoose.connection.close();
    // console.log('MongoDB connection closed');
  }
};

addPlayers();
