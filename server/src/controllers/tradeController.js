const Trade = require('../models/Trade'); // Assuming you have a Trade model
const Player = require('../models/Player'); // We'll need this for player validation

const tradeController = {
  // Get all trades
  getAllTrades: async (req, res) => {
    try {
      const trades = await Trade.find();
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single trade by ID
  getTradeById: async (req, res) => {
    try {
      const trade = await Trade.findById(req.params.id);
      if (!trade) return res.status(404).json({ message: 'Trade not found' });
      res.json(trade);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new trade
  createTrade: async (req, res) => {
    const { player1Id, player2Id, itemsOffered, itemsRequested } = req.body;

    try {
      // Validate that both players exist
      const player1 = await Player.findById(player1Id);
      const player2 = await Player.findById(player2Id);
      if (!player1 || !player2) {
        return res.status(400).json({ message: 'One or both players not found' });
      }

      const trade = new Trade({
        player1: player1Id,
        player2: player2Id,
        itemsOffered,
        itemsRequested,
        status: 'pending'
      });

      const newTrade = await trade.save();
      res.status(201).json(newTrade);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a trade (e.g., accept or reject)
  updateTrade: async (req, res) => {
    try {
      const updatedTrade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedTrade);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a trade
  deleteTrade: async (req, res) => {
    try {
      await Trade.findByIdAndDelete(req.params.id);
      res.json({ message: 'Trade deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = tradeController;
