import express from 'express';

const router = express.Router();

router.post('/daily-progress', async (req, res) => {
    try {
        console.log('Received daily progress data:', req.body);
        res.status(200).json({ success: true, message: 'Daily progress recorded successfully!' });
    }
    catch (err) {
        console.error('Error in daily progress route:', err);
        res.status(500).json({ success: false, message: 'Failed to record daily progress.' });
    }
});

export default router;