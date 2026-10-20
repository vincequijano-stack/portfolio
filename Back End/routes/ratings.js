'use strict';

const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/ratings — fetch reviews and overall average rating
router.get('/', (req, res) => {
  try {
    const data = db.getRatings();
    res.json({ success: true, ...data });
  } catch (err) {
    console.error('[routes/ratings] GET error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve ratings' });
  }
});

// POST /api/ratings — submit a new client rating / review
router.post('/', (req, res) => {
  try {
    const { rating, name, role, feedback } = req.body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5' });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const result = db.addRating({ rating: numRating, name, role, feedback });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[routes/ratings] POST error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save rating' });
  }
});

module.exports = router;
