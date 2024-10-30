import express from 'express';
const router = express.Router();

// Increment submissions counter
router.post('/increment-submissions', async (req, res) => {
  const db = req.app.get('db');
  
  try {
    const result = await db.collection('ktc_stats').updateOne(
      { id: 'global' },
      { $inc: { submissions: 1 } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error incrementing submissions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current stats (optional, if you want to display the count somewhere)
router.get('/', async (req, res) => {
  const db = req.app.get('db');
  
  try {
    const stats = await db.collection('ktc_stats').findOne({ id: 'global' });
    res.json(stats || { submissions: 0 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
