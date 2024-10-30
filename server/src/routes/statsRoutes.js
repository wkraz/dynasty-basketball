import express from 'express';
const router = express.Router();

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`Stats Route Hit: ${req.method} ${req.url}`);
  next();
});

// Handle POST request
router.post('/increment-submissions', async (req, res) => {
  try {
    const db = req.app.get('db');
    console.log('Attempting to increment submissions...');
    
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
    console.error('Error in increment-submissions:', error);
    res.status(500).json({ error: error.toString() });
  }
});

// Handle GET request (return current count)
router.get('/increment-submissions', (req, res) => {
  // Inform client that POST is required
  res.status(405).json({ 
    error: 'Method Not Allowed',
    message: 'Please use POST method for this endpoint'
  });
});

export default router;
