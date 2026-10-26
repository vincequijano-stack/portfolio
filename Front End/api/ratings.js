// /api/ratings — public client reviews.
//   GET  ?offset=0&limit=10          → paginated public reviews (newest first) + average/count of eligible reviews
//   POST {rating,name,role,feedback,visitorId}  → submit a review (no login; display name required)
//   POST ?action=moderate {id,hidden}           → owner only: hide / unhide a review
//   POST ?action=import {reviews:[...]}         → owner only: one-time import of reviews cached in the owner's browser

import { randomBytes } from 'crypto';
import { getStore } from './_lib/store.js';
import {
  send,
  getBody,
  getQuery,
  clientIp,
  isOwnerRequest,
  requireOwner,
  enforceRateLimit,
  handleError,
  methodNotAllowed,
  HttpError,
} from './_lib/http.js';
import {
  LIMITS,
  cleanLine,
  cleanMultiline,
  validateDisplayName,
  isValidVisitorId,
  isValidReviewId,
  parseRating,
  clampInt,
} from './_lib/validate.js';

const DEFAULT_ROLE = 'Client / Collaborator';

/** Only public fields leave the server (no visitorId, IP, etc.). */
function toPublic(review, includeModeration) {
  const out = {
    id: review.id,
    rating: review.rating,
    name: review.name,
    role: review.role || '',
    feedback: review.feedback || '',
    createdAt: review.createdAt || new Date(review.timestamp || 0).toISOString(),
    timestamp: review.timestamp || 0,
  };
  if (includeModeration) out.hidden = Boolean(review.hidden);
  return out;
}

function stats(reviews) {
  if (reviews.length === 0) return { average: '0.0', count: 0 };
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return { average: (sum / reviews.length).toFixed(1), count: reviews.length };
}

const SEED_REVIEWS = [
  {
    id: 'rev_raziel_sevilla',
    rating: 5,
    name: 'Raziel Sevilla',
    role: 'Client / Collaborator',
    feedback: 'If Vince is on your team, you can breathe easy. Unmatched reliability, zero friction, and consistent, high-quality execution every single time.',
    createdAt: '2026-10-26T15:45:00.000Z',
    timestamp: 1793029500000,
    hidden: false,
  },
  {
    id: 'rev_1793029406291_6ece00c99e',
    rating: 5,
    name: 'Kier',
    role: 'Client',
    feedback: 'He helps me create a design for our website.',
    createdAt: '2026-10-26T15:43:26.291Z',
    timestamp: 1793029406291,
    hidden: false,
  },
  {
    id: 'rev_ezon',
    rating: 5,
    name: 'Ezon',
    role: 'Groupmate',
    feedback: 'solved my problem in our capstone system',
    createdAt: '2026-10-26T15:40:00.000Z',
    timestamp: 1793029200000,
    hidden: false,
  },
];

async function listReviews(req, res, store) {
  const query = getQuery(req);
  const offset = clampInt(query.offset, 0, 100000, 0);
  const limit = clampInt(query.limit, 1, 50, 10);
  const owner = isOwnerRequest(req);

  const raw = store ? await store.listReviews() : [];
  const dbReviews = (raw || []).filter((r) => r && r.id && parseRating(r.rating));
  
  // Merge DB reviews with SEED_REVIEWS (DB records take precedence, deduplicated by reviewer name)
  const byName = new Map();
  dbReviews.forEach((r) => {
    if (r && r.name) byName.set(r.name.trim().toLowerCase(), r);
  });
  SEED_REVIEWS.forEach((r) => {
    const key = r.name.trim().toLowerCase();
    if (!byName.has(key)) byName.set(key, r);
  });
  const all = Array.from(byName.values());

  all.sort(newestFirst);
  const eligible = all.filter((r) => !r.hidden);
  const visible = owner ? all : eligible;
  const page = visible.slice(offset, offset + limit);

  return send(res, 200, {
    success: true,
    reviews: page.map((r) => toPublic(r, owner)),
    ...stats(eligible),
    total: visible.length,
    offset,
    limit,
    hasMore: offset + page.length < visible.length,
    isOwner: owner,
  });
}

async function createReview(req, res, store) {
  const body = getBody(req);
  const rating = parseRating(body.rating);
  if (!rating) throw new HttpError(400, 'Rating must be a whole number between 1 and 5.');

  const name = validateDisplayName(body.name);
  if (!name.ok) throw new HttpError(400, name.error);

  if (!isValidVisitorId(body.visitorId)) throw new HttpError(400, 'Missing or invalid visitor session.');

  if (typeof body.feedback === 'string' && body.feedback.trim().length > LIMITS.feedback) {
    throw new HttpError(400, `Feedback must be ${LIMITS.feedback} characters or fewer.`);
  }

  await enforceRateLimit(store, `review:v:${body.visitorId}`, 3, 10 * 60);
  await enforceRateLimit(store, `review:ip:${clientIp(req)}`, 10, 60 * 60);

  const now = Date.now();
  const review = {
    id: `rev_${now}_${randomBytes(5).toString('hex')}`,
    rating,
    name: name.value,
    role: cleanLine(body.role, LIMITS.role) || DEFAULT_ROLE,
    feedback: cleanMultiline(body.feedback, LIMITS.feedback),
    visitorId: body.visitorId, // stored for abuse handling only; never returned publicly
    timestamp: now,
    createdAt: new Date(now).toISOString(),
    hidden: false,
  };

  const inserted = await store.insertReview(review);
  if (!inserted) throw new HttpError(409, 'Please try submitting again.');

  const eligible = (await store.listReviews()).filter((r) => r && !r.hidden && parseRating(r.rating));
  return send(res, 201, { success: true, review: toPublic(review, false), ...stats(eligible) });
}

async function moderateReview(req, res, store) {
  requireOwner(req);
  const body = getBody(req);
  if (!isValidReviewId(body.id)) throw new HttpError(400, 'Invalid review id.');
  const review = await store.getReview(body.id);
  if (!review) throw new HttpError(404, 'Review not found.');
  review.hidden = Boolean(body.hidden);
  await store.updateReview(review);
  return send(res, 200, { success: true, review: toPublic(review, true) });
}

async function importReviews(req, res, store) {
  requireOwner(req);
  const body = getBody(req);
  const incoming = Array.isArray(body.reviews) ? body.reviews.slice(0, 200) : [];
  let imported = 0;
  let skipped = 0;
  const now = Date.now();

  for (const r of incoming) {
    const rating = parseRating(r && r.rating);
    const name = validateDisplayName(r && r.name);
    if (!r || !isValidReviewId(r.id) || r.id.startsWith('rev_seed') || !rating || !name.ok) {
      skipped += 1;
      continue;
    }
    const ts = Number(r.timestamp);
    const timestamp = Number.isFinite(ts) && ts > Date.UTC(2020, 0, 1) && ts <= now ? ts : now;
    const inserted = await store.insertReview({
      id: r.id,
      rating,
      name: name.value,
      role: cleanLine(r.role, LIMITS.role) || DEFAULT_ROLE,
      feedback: cleanMultiline(r.feedback, LIMITS.feedback),
      visitorId: null,
      timestamp,
      createdAt: new Date(timestamp).toISOString(),
      hidden: false,
      importedAt: new Date(now).toISOString(),
    });
    if (inserted) imported += 1;
    else skipped += 1; // already in the database — never overwritten
  }

  return send(res, 200, { success: true, imported, skipped });
}

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, {});
    let store = null;
    try {
      store = getStore();
    } catch (storeErr) {
      if (req.method !== 'GET') throw storeErr;
    }
    if (req.method === 'GET') return await listReviews(req, res, store);
    if (req.method === 'POST') {
      const action = getQuery(req).action;
      if (action === 'moderate') return await moderateReview(req, res, store);
      if (action === 'import') return await importReviews(req, res, store);
      if (action) throw new HttpError(400, 'Unknown action.');
      return await createReview(req, res, store);
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (err) {
    return handleError(res, err, 'ratings');
  }
}
