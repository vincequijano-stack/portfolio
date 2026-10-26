'use strict';

// Local development only: delegates to the same handler that runs on Vercel (Front End/api/likes.js).

const express = require('express');
const { loadApiHandler } = require('./apiBridge');

const router = express.Router();
router.all('/', loadApiHandler('likes'));

module.exports = router;
