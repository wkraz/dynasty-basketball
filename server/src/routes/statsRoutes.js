import express from 'express';
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`Stats Route - ${req.method} ${req.path}`);
  next();
});

// POST route for incrementing
router.post('/increment-submissions', async (req, res) => {
  const db = req.app.get('db');
  console.log('Received increment request');
  
  try {
    const result = await db.collection('ktc_stats').updateOne(
      { id: 'global' },
      { $inc: { submissions: 1 } },
      { upsert: true }
    );
    
    const updated = await db.collection('ktc_stats').findOne({ id: 'global' });
    console.log('Updated stats:', updated);
    
    res.json({
      success: true,
      submissions: updated.submissions
    });
  } catch (error) {
    console.error('Error incrementing submissions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET route for fetching stats
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
