const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });

// Define your Player model
const PlayerSchema = new mongoose.Schema({
  name: String,
  team: String,
  positions: [String],
  birthday: Date,
  value: Number,
});

const Player = mongoose.model('Player', PlayerSchema);

const calculateAge = (birthday) => {
  const ageDifMs = Date.now() - new Date(birthday).getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const addPlayers = async () => {
  try {
    // Read the players.json file
    const playersFilePath = path.join(__dirname, 'players.json');
    const players = JSON.parse(fs.readFileSync(playersFilePath, 'utf8'));

    // Loop through each player and add to the database
    for (let playerData of players) {
      // Check if player already exists
      const existingPlayer = await Player.findOne({ name: playerData.name });

      // Convert birthday string to Date object
      playerData.birthday = new Date(playerData.birthday);

      if (existingPlayer) {
        // Update existing player
        await Player.updateOne({ name: playerData.name }, playerData);
        console.log(`Updated player: ${playerData.name}`);
      } else {
        // Add new player
        const newPlayer = new Player(playerData);
        await newPlayer.save();
        console.log(`Added new player: ${playerData.name}`);
      }

      // Calculate and log the player's current age
      const age = calculateAge(playerData.birthday);
      console.log(`${playerData.name}'s current age: ${age}`);
    }

    console.log('All players have been processed.');
  } catch (error) {
    console.error('Error processing players:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the function
addPlayers();
