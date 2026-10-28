// Persistent storage for reviews and likes.
//
// Production (Vercel): Upstash Redis over its REST API. Credentials are read from server-side env vars
//   KV_REST_API_URL / KV_REST_API_TOKEN (injected by the Vercel Marketplace Upstash integration) or
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN. They are never exposed to the browser.
// Local development: the existing Back End/data/portfolio_db.json file (same shape as before).

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class StorageNotConfiguredError extends Error {
  constructor() {
    super('Persistent storage is not configured on the server.');
    this.code = 'STORAGE_NOT_CONFIGURED';
  }
}

const KEY_PREFIX = 'pf:';
const REVIEWS_KEY = `${KEY_PREFIX}reviews`;
const likesKey = (projectId) => `${KEY_PREFIX}likes:${projectId}`;
const commentsKey = (projectId) => `${KEY_PREFIX}comments:${projectId}`;
const rateKey = (key) => `${KEY_PREFIX}rl:${key}`;

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ''), token } : null;
}

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ── Redis (Upstash REST) adapter ──────────────────────────────
function createRedisStore({ url, token }) {
  async function pipeline(commands) {
    const res = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
    });
    if (!res.ok) throw new Error(`Redis HTTP ${res.status}`);
    const out = await res.json();
    return out.map((r) => {
      if (r && r.error) throw new Error(`Redis error: ${r.error}`);
      return r ? r.result : null;
    });
  }

  return {
    kind: 'redis',

    async listReviews() {
      const [values] = await pipeline([['HVALS', REVIEWS_KEY]]);
      return (values || []).map(safeParse).filter(Boolean);
    },

    async getReview(id) {
      const [value] = await pipeline([['HGET', REVIEWS_KEY, id]]);
      return value ? safeParse(value) : null;
    },

    /** Inserts only if the id does not exist yet. Returns true when inserted. */
    async insertReview(review) {
      const [added] = await pipeline([['HSETNX', REVIEWS_KEY, review.id, JSON.stringify(review)]]);
      return added === 1;
    },

    async updateReview(review) {
      await pipeline([['HSET', REVIEWS_KEY, review.id, JSON.stringify(review)]]);
    },

    /** Atomic + idempotent: a visitor can hold at most one like per project. */
    async addLike(projectId, visitorId, data) {
      const [added] = await pipeline([['HSETNX', likesKey(projectId), visitorId, JSON.stringify(data)]]);
      return added === 1;
    },

    async removeLike(projectId, visitorId) {
      const [removed] = await pipeline([['HDEL', likesKey(projectId), visitorId]]);
      return removed === 1;
    },

    async countLikes(projectIds) {
      if (projectIds.length === 0) return {};
      const results = await pipeline(projectIds.map((id) => ['HLEN', likesKey(id)]));
      return Object.fromEntries(projectIds.map((id, i) => [id, Number(results[i]) || 0]));
    },

    async likedBy(projectIds, visitorId) {
      if (projectIds.length === 0) return {};
      const results = await pipeline(projectIds.map((id) => ['HEXISTS', likesKey(id), visitorId]));
      return Object.fromEntries(projectIds.map((id, i) => [id, results[i] === 1]));
    },

    async listLikers(projectId) {
      const [values] = await pipeline([['HVALS', likesKey(projectId)]]);
      return (values || []).map(safeParse).filter(Boolean);
    },

    async listComments(projectId) {
      const [values] = await pipeline([['HVALS', commentsKey(projectId)]]);
      return (values || []).map(safeParse).filter(Boolean).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    },

    async insertComment(projectId, comment) {
      const [added] = await pipeline([['HSET', commentsKey(projectId), comment.id, JSON.stringify(comment)]]);
      return added === 1;
    },

    async deleteComment(projectId, commentId) {
      const [removed] = await pipeline([['HDEL', commentsKey(projectId), commentId]]);
      return removed === 1;
    },

    async countComments(projectIds) {
      if (projectIds.length === 0) return {};
      const results = await pipeline(projectIds.map((id) => ['HLEN', commentsKey(id)]));
      return Object.fromEntries(projectIds.map((id, i) => [id, Number(results[i]) || 0]));
    },

    /** Fixed-window counter. Returns the hit count for the current window. */
    async hit(key, windowSec) {
      const k = rateKey(key);
      const [, count] = await pipeline([
        ['SET', k, '0', 'EX', String(windowSec), 'NX'],
        ['INCR', k],
      ]);
      return Number(count) || 0;
    },
  };
}

// ── JSON file adapter (local development) ─────────────────────
function createFileStore(filePath) {
  let chain = Promise.resolve();
  const withLock = (fn) => {
    const run = chain.then(fn, fn);
    chain = run.catch(() => {});
    return run;
  };
  const rateHits = new Map();

  async function read() {
    let data = {};
    try {
      data = JSON.parse(await fs.readFile(filePath, 'utf-8')) || {};
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    const likedBy = {};
    for (const [pid, list] of Object.entries(data.likedBy || {})) {
      likedBy[pid] = (Array.isArray(list) ? list : [])
        .map((item) =>
          typeof item === 'string'
            ? { visitorId: item, userName: '', timestamp: 0 } // legacy entries had no name
            : item
        )
        .filter((item) => item && item.visitorId);
    }
    const comments = {};
    for (const [pid, list] of Object.entries(data.comments || {})) {
      comments[pid] = Array.isArray(list) ? list : [];
    }
    return {
      likes: data.likes || {},
      likedBy,
      reviews: Array.isArray(data.reviews) ? data.reviews : [],
      comments,
    };
  }

  async function write(db) {
    // Keep the legacy `likes` counters in sync with the authoritative likedBy lists.
    for (const pid of Object.keys(db.likedBy)) db.likes[pid] = db.likedBy[pid].length;
    db.comments = db.comments || {};
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const tmp = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf-8');
    await fs.rename(tmp, filePath);
  }

  return {
    kind: 'file',

    listReviews: () => withLock(async () => (await read()).reviews),

    getReview: (id) => withLock(async () => (await read()).reviews.find((r) => r.id === id) || null),

    insertReview: (review) =>
      withLock(async () => {
        const db = await read();
        if (db.reviews.some((r) => r.id === review.id)) return false;
        db.reviews.unshift(review);
        await write(db);
        return true;
      }),

    updateReview: (review) =>
      withLock(async () => {
        const db = await read();
        const idx = db.reviews.findIndex((r) => r.id === review.id);
        if (idx === -1) return;
        db.reviews[idx] = review;
        await write(db);
      }),

    addLike: (projectId, visitorId, data) =>
      withLock(async () => {
        const db = await read();
        const list = (db.likedBy[projectId] = db.likedBy[projectId] || []);
        if (list.some((l) => l.visitorId === visitorId)) return false;
        list.unshift({ visitorId, ...data });
        await write(db);
        return true;
      }),

    removeLike: (projectId, visitorId) =>
      withLock(async () => {
        const db = await read();
        const list = db.likedBy[projectId] || [];
        const idx = list.findIndex((l) => l.visitorId === visitorId);
        if (idx === -1) return false;
        list.splice(idx, 1);
        await write(db);
        return true;
      }),

    countLikes: (projectIds) =>
      withLock(async () => {
        const db = await read();
        return Object.fromEntries(projectIds.map((id) => [id, (db.likedBy[id] || []).length]));
      }),

    likedBy: (projectIds, visitorId) =>
      withLock(async () => {
        const db = await read();
        return Object.fromEntries(
          projectIds.map((id) => [id, (db.likedBy[id] || []).some((l) => l.visitorId === visitorId)])
        );
      }),

    listLikers: (projectId) => withLock(async () => (await read()).likedBy[projectId] || []),

    listComments: (projectId) =>
      withLock(async () => {
        const db = await read();
        const list = (db.comments && db.comments[projectId]) || [];
        return list.slice().sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      }),

    insertComment: (projectId, comment) =>
      withLock(async () => {
        const db = await read();
        db.comments = db.comments || {};
        const list = (db.comments[projectId] = db.comments[projectId] || []);
        list.push(comment);
        await write(db);
        return true;
      }),

    deleteComment: (projectId, commentId) =>
      withLock(async () => {
        const db = await read();
        if (!db.comments || !db.comments[projectId]) return false;
        const initial = db.comments[projectId].length;
        db.comments[projectId] = db.comments[projectId].filter((c) => c.id !== commentId);
        if (db.comments[projectId].length !== initial) {
          await write(db);
          return true;
        }
        return false;
      }),

    countComments: (projectIds) =>
      withLock(async () => {
        const db = await read();
        const comments = db.comments || {};
        return Object.fromEntries(projectIds.map((id) => [id, (comments[id] || []).length]));
      }),

    async hit(key, windowSec) {
      const now = Date.now();
      const entry = rateHits.get(key);
      if (!entry || entry.resetAt <= now) {
        rateHits.set(key, { count: 1, resetAt: now + windowSec * 1000 });
        return 1;
      }
      entry.count += 1;
      return entry.count;
    },
  };
}

let cached = null;

export function getStore() {
  if (cached) return cached;
  const redis = redisConfig();
  if (redis) {
    cached = createRedisStore(redis);
  } else if (process.env.VERCEL) {
    // Vercel's filesystem is read-only/ephemeral — never silently fall back to a file there.
    throw new StorageNotConfiguredError();
  } else {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const filePath =
      process.env.PORTFOLIO_DB_FILE ||
      path.resolve(here, '..', '..', '..', 'Back End', 'data', 'portfolio_db.json');
    cached = createFileStore(filePath);
  }
  return cached;
}
