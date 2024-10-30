import express from 'express';
const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Stats route is working' });
});

router.post('/increment-submissions', async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) {
      console.error('Database not found in app context');
      return res.status(500).json({ error: 'Database connection not available' });
    }

    const result = await db.collection('ktc_stats').updateOne(
      { id: 'global' },
      { $inc: { submissions: 1 } },
      { upsert: true }
    );
    
    const updated = await db.collection('ktc_stats').findOne({ id: 'global' });
    res.json({
      success: true,
      submissions: updated?.submissions || 0
    });
  } catch (error) {
    console.error('Error in increment-submissions:', error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    if (!db) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const stats = await db.collection('ktc_stats').findOne({ id: 'global' });
    res.json(stats || { submissions: 0 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.toString() });
  }
});

export default router;
