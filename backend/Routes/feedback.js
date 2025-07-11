// routes/feedback.js
import express from 'express';
import Feedback from '../Schema/feedback.js';

const router = express.Router();

// POST /api/feedback
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Feedback is required.' });
    }

    const feedback = new Feedback({ text });
    await feedback.save();

    res.status(201).json({ message: 'Feedback saved successfully!' });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
