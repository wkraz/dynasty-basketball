const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// GET all players
router.get('/', playerController.getAllPlayers);

// GET a single player by ID
router.get('/:id', playerController.getPlayerById);

// POST create a new player
router.post('/', playerController.createPlayer);

// PUT update a player
router.put('/:id', playerController.updatePlayer);

// DELETE a player
router.delete('/:id', playerController.deletePlayer);

module.exports = router;

