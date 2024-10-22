import express from 'express';
import * as tradeController from '../controllers/tradeController.js';

const router = express.Router();

// GET all trades
router.get('/', tradeController.getAllTrades);

// GET a single trade by ID
router.get('/:id', tradeController.getTradeById);

// POST create a new trade
router.post('/', tradeController.createTrade);

// PUT update a trade (e.g., accept or reject)
router.put('/:id', tradeController.updateTrade);

// DELETE a trade
router.delete('/:id', tradeController.deleteTrade);

export default router;
