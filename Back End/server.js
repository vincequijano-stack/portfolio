/* ============================================================
   SERVER.JS
   Express.js backend for portfolio contact form
   Run: node server.js (or: npm run dev with nodemon)
   EDIT: See .env.example for configuration
   ============================================================ */

'use strict';

const path       = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const contactRoute = require('./routes/contact');
const likesRoute   = require('./routes/likes');
const ratingsRoute = require('./routes/ratings');
const commentsRoute = require('./routes/comments');
const { loadApiHandler } = require('./routes/apiBridge');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS ──────────────────────────────────────────────────────
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];
const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parser ───────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Rate Limiting ─────────────────────────────────────────────
// EDIT: Adjust windowMs and max to your preference
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // max 5 submissions per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

// ── Routes ────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api/contact', contactLimiter, contactRoute);
app.use('/api/likes', likesRoute);
app.use('/api/ratings', ratingsRoute);
app.use('/api/comments', commentsRoute);
app.get('/api/owner', loadApiHandler('owner'));

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[server] Error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Likes API:    GET/POST http://localhost:${PORT}/api/likes`);
  console.log(`   Ratings API:  GET/POST http://localhost:${PORT}/api/ratings`);
  console.log(`   Comments API: GET/POST/DELETE http://localhost:${PORT}/api/comments`);
  console.log(`   Contact API:  POST http://localhost:${PORT}/api/contact\n`);
});
