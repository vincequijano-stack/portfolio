'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio_db.json');

const INITIAL_DB = {
  likes: {
    'cobuy-pattern-mining': 0,
    'cryptita-plays-builder-workshop': 0,
    'personal-portfolio': 0
  },
  likedBy: {
    'cobuy-pattern-mining': [],
    'cryptita-plays-builder-workshop': [],
    'personal-portfolio': []
  },
  reviews: []
};

function ensureDbFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDbFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return {
      likes: data.likes || {},
      likedBy: data.likedBy || {},
      reviews: Array.isArray(data.reviews) ? data.reviews : []
    };
  } catch (err) {
    console.error('[DB] Failed reading db file, using initial fallback:', err.message);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }
}

function writeDb(data) {
  ensureDbFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DB] Failed writing db file:', err.message);
    return false;
  }
}

function calculateAverage(reviews) {
  if (!reviews || reviews.length === 0) {
    return { average: '0.0', count: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const avg = (sum / reviews.length).toFixed(1);
  return { average: avg, count: reviews.length };
}

// ── Likes Methods ─────────────────────────────────────────────
function getAllLikes() {
  const db = readDb();
  return {
    likes: db.likes || {},
    likers: db.likedBy || {}
  };
}

function toggleLike(projectId, visitorId, isLiked, userName) {
  const db = readDb();
  if (db.likes[projectId] === undefined) {
    db.likes[projectId] = 0;
  }
  if (!Array.isArray(db.likedBy[projectId])) {
    db.likedBy[projectId] = [];
  }

  // Find index of existing like by visitorId or userName
  const existingIndex = db.likedBy[projectId].findIndex((item) => {
    if (typeof item === 'object' && item !== null) {
      return item.visitorId === visitorId || (userName && item.userName === userName);
    }
    return item === visitorId;
  });
  const alreadyLiked = existingIndex !== -1;

  // If client sends explicit isLiked status
  let finalLiked = isLiked !== undefined ? Boolean(isLiked) : !alreadyLiked;

  const displayName = (userName && String(userName).trim()) || 'Visitor';

  if (finalLiked) {
    if (!alreadyLiked) {
      db.likedBy[projectId].unshift({
        visitorId,
        userName: displayName,
        timestamp: Date.now()
      });
      db.likes[projectId] = Math.max(db.likes[projectId] + 1, db.likedBy[projectId].length);
    } else {
      if (typeof db.likedBy[projectId][existingIndex] === 'object') {
        db.likedBy[projectId][existingIndex].userName = displayName;
      }
    }
  } else {
    if (alreadyLiked) {
      db.likedBy[projectId].splice(existingIndex, 1);
      db.likes[projectId] = Math.max(0, db.likes[projectId] - 1);
    }
  }

  writeDb(db);

  return {
    projectId,
    likesCount: db.likes[projectId],
    likers: db.likedBy[projectId],
    isLiked: finalLiked
  };
}

// ── Ratings Methods ───────────────────────────────────────────
function getRatings() {
  const db = readDb();
  const stats = calculateAverage(db.reviews);
  return {
    reviews: db.reviews,
    average: stats.average,
    count: stats.count
  };
}

function addRating({ rating, name, role, feedback }) {
  const db = readDb();
  const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

  const newReview = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    rating: numRating,
    name: (name || 'Anonymous Client').trim(),
    role: (role || 'Client / Collaborator').trim(),
    feedback: (feedback || '').trim(),
    date: 'Just now',
    timestamp: Date.now()
  };

  db.reviews.unshift(newReview);
  writeDb(db);

  const stats = calculateAverage(db.reviews);
  return {
    review: newReview,
    reviews: db.reviews,
    average: stats.average,
    count: stats.count
  };
}

module.exports = {
  getAllLikes,
  toggleLike,
  getRatings,
  addRating
};
