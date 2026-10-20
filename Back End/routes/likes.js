'use strict';

const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/likes — fetch all project like counts
router.get('/', (req, res) => {
  try {
    const likes = db.getAllLikes();
    res.json({ success: true, likes });
  } catch (err) {
    console.error('[routes/likes] GET error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve likes' });
  }
});

// POST /api/likes — toggle or update like status
router.post('/', (req, res) => {
  try {
    const { projectId, visitorId, isLiked } = req.body;
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'projectId is required' });
    }

    const clientVisitorId = visitorId || req.ip || 'anonymous_guest';
    const result = db.toggleLike(projectId, clientVisitorId, isLiked);

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[routes/likes] POST error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update like' });
  }
});

module.exports = router;
