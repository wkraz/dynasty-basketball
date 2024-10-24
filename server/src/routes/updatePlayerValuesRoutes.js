import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.options('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

router.post('/', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");

  console.log('Received update player values request');
  const { choices, players } = req.body;
  const db = req.app.locals.db;
  const collection = db.collection('nba_players');

  try {
    const sortedPlayers = players.sort((a, b) => b.value - a.value);
    const updates = [];

    for (let i = 0; i < sortedPlayers.length; i++) {
      let valueChange = 0;
      const currentPlayer = sortedPlayers[i];
      const currentChoice = choices[currentPlayer._id];
      const currentRank = ['keep', 'trade', 'cut'].indexOf(currentChoice);

      for (let j = 0; j < sortedPlayers.length; j++) {
        if (i !== j) {
          const otherPlayer = sortedPlayers[j];
          const otherChoice = choices[otherPlayer._id];
          const otherRank = ['keep', 'trade', 'cut'].indexOf(otherChoice);

          if (currentRank < otherRank && currentPlayer.value < otherPlayer.value) {
            valueChange += 3;
          } else if (currentRank > otherRank && currentPlayer.value > otherPlayer.value) {
            valueChange -= 3;
          }
        }
      }

      let newValue = Math.min(Math.max(currentPlayer.value + valueChange, 0), 9999);
      valueChange = newValue - currentPlayer.value;

      if (valueChange !== 0) {
        updates.push({
          updateOne: {
            filter: { _id: new ObjectId(currentPlayer._id) },
            update: { $inc: { value: valueChange } }
          }
        });
      }
    }

    if (updates.length > 0) {
      await collection.bulkWrite(updates);
    }

    res.json({ message: 'Player values updated successfully' });
  } catch (error) {
    console.error('Error updating player values:', error);
    res.status(500).json({ error: 'Error updating player values' });
  }
});

export default router;
