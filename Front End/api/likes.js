// /api/likes — public post likes.
//   GET  ?ids=a,b,c&visitorId=...        → { likes: {id: count}, liked: {id: bool} } (public)
//   GET  ?projectId=a&likers=1           → owner only: display names of people who liked the post
//   POST {projectId, visitorId, liked, userName} → like (idempotent) / unlike; returns authoritative count

import { getStore } from './_lib/store.js';
import {
  send,
  getBody,
  getQuery,
  clientIp,
  requireOwner,
  enforceRateLimit,
  handleError,
  methodNotAllowed,
  HttpError,
} from './_lib/http.js';
import { validateDisplayName, isValidVisitorId, isValidProjectId } from './_lib/validate.js';

const MAX_IDS = 50;

const SEED_LIKES = {
  'cobuy-pattern-mining': 6,
  'cryptita-plays-builder-workshop': 5,
  'personal-portfolio': 5,
};

const SEED_LIKERS = {
  'cobuy-pattern-mining': [
    { userName: 'Kier', timestamp: 1793029527178 },
    { userName: 'Raziel Sevilla', timestamp: 1792943127000 },
    { userName: 'Ezon', timestamp: 1792511127000 },
  ],
  'cryptita-plays-builder-workshop': [
    { userName: 'Kier', timestamp: 1792943127000 },
    { userName: 'Ezon', timestamp: 1792511127000 },
    { userName: 'Raziel Sevilla', timestamp: 1792943127000 },
  ],
  'personal-portfolio': [
    { userName: 'Kier', timestamp: 1792943127000 },
    { userName: 'Ezon', timestamp: 1792511127000 },
    { userName: 'Raziel Sevilla', timestamp: 1792943127000 },
  ],
};

async function getLikes(req, res, store) {
  const query = getQuery(req);

  if (query.likers) {
    requireOwner(req);
    if (!isValidProjectId(query.projectId)) throw new HttpError(400, 'Invalid projectId.');
    const raw = store ? await store.listLikers(query.projectId) : [];
    const likers = (raw.length > 0 ? raw : SEED_LIKERS[query.projectId] || [])
      .map((l) => ({ userName: l.userName || '', timestamp: Number(l.timestamp) || 0 }))
      .sort((a, b) => b.timestamp - a.timestamp);
    return send(res, 200, { success: true, projectId: query.projectId, likers, count: likers.length });
  }

  const ids = Array.from(
    new Set(
      String(query.ids || '')
        .split(',')
        .map((s) => s.trim())
        .filter(isValidProjectId)
    )
  ).slice(0, MAX_IDS);

  const rawLikes = store ? await store.countLikes(ids) : {};
  const likes = {};
  ids.forEach((id) => {
    likes[id] = Math.max(rawLikes[id] || 0, SEED_LIKES[id] || 0);
  });
  const liked = isValidVisitorId(query.visitorId) && store ? await store.likedBy(ids, query.visitorId) : {};
  return send(res, 200, { success: true, likes, liked });
}

async function setLike(req, res, store) {
  const body = getBody(req);
  const { projectId, visitorId } = body;
  if (!isValidProjectId(projectId)) throw new HttpError(400, 'Invalid projectId.');
  if (!isValidVisitorId(visitorId)) throw new HttpError(400, 'Missing or invalid visitor session.');
  if (typeof body.liked !== 'boolean') throw new HttpError(400, '`liked` must be true or false.');

  if (store) {
    await enforceRateLimit(store, `like:ip:${clientIp(req)}`, 60, 60);

    if (body.liked) {
      const name = validateDisplayName(body.userName);
      if (!name.ok) throw new HttpError(400, name.error);
      await store.addLike(projectId, visitorId, { userName: name.value, timestamp: Date.now() });
    } else {
      await store.removeLike(projectId, visitorId);
    }

    const [counts, liked] = await Promise.all([
      store.countLikes([projectId]),
      store.likedBy([projectId], visitorId),
    ]);
    return send(res, 200, {
      success: true,
      projectId,
      likesCount: Math.max(counts[projectId] || 0, SEED_LIKES[projectId] || 0),
      isLiked: Boolean(liked[projectId]),
    });
  }

  // Fallback when storage is not configured
  return send(res, 200, {
    success: true,
    projectId,
    likesCount: (SEED_LIKES[projectId] || 0) + (body.liked ? 1 : 0),
    isLiked: body.liked,
  });
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
    if (req.method === 'GET') return await getLikes(req, res, store);
    if (req.method === 'POST') return await setLike(req, res, store);
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (err) {
    return handleError(res, err, 'likes');
  }
}
