import express from 'express';
const router = express.Router();

// GET endpoint for current stats
router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const stats = await db.collection('ktc_stats').findOne({ id: 'global' });
    res.json(stats || { submissions: 0 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.toString() });
  }
});

// Handle GET request to increment endpoint by redirecting
router.get('/increment-submissions', (req, res) => {
  res.redirect('/api/stats');
});

// POST endpoint for incrementing
router.post('/increment-submissions', async (req, res) => {
  try {
    const db = req.app.get('db');
    const result = await db.collection('ktc_stats').updateOne(
      { id: 'global' },
      { $inc: { submissions: 1 } },
      { upsert: true }
    );
    
    const updated = await db.collection('ktc_stats').findOne({ id: 'global' });
    res.json({
      success: true,
      submissions: updated.submissions
    });
  } catch (error) {
    console.error('Error in increment-submissions:', error);
    res.status(500).json({ error: error.toString() });
  }
});

export default router;
