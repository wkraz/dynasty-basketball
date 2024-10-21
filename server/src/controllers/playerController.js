const Player = require('../models/Player'); // Assuming you have a Player model

const playerController = {
  // Get all players
  getAllPlayers: async (req, res) => {
    try {
      const players = await Player.find();
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single player by ID
  getPlayerById: async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);
      if (!player) return res.status(404).json({ message: 'Player not found' });
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new player
  createPlayer: async (req, res) => {
    const player = new Player({
      name: req.body.name,
      // Add other player properties as needed
    });

    try {
      const newPlayer = await player.save();
      res.status(201).json(newPlayer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a player
  updatePlayer: async (req, res) => {
    try {
      const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedPlayer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a player
  deletePlayer: async (req, res) => {
    try {
      await Player.findByIdAndDelete(req.params.id);
      res.json({ message: 'Player deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = playerController;

