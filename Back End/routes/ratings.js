'use strict';

// Local development only: delegates to the same handler that runs on Vercel (Front End/api/ratings.js),
// so local and production share one implementation. Data is stored in data/portfolio_db.json locally.

const express = require('express');
const { loadApiHandler } = require('./apiBridge');

const router = express.Router();
router.all('/', loadApiHandler('ratings'));

module.exports = router;
