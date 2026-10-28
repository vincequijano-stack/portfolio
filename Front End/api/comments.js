// /api/comments — public project comments & inquiries.
//   GET  ?projectId=...                 → { success: true, projectId, comments: [...], count }
//   GET  ?ids=a,b,c                     → { success: true, counts: { [id]: count } }
//   POST { projectId, visitorId, userName, text, avatar } → creates comment & returns updated list
//   DELETE ?projectId=...&commentId=...&visitorId=...    → deletes comment if author or owner

import { getStore } from './_lib/store.js';
import {
  send,
  getBody,
  getQuery,
  clientIp,
  isOwnerRequest,
  enforceRateLimit,
  handleError,
  methodNotAllowed,
  HttpError,
} from './_lib/http.js';
import {
  validateDisplayName,
  validateCommentText,
  isValidVisitorId,
  isValidProjectId,
  isValidCommentId,
} from './_lib/validate.js';

const MAX_IDS = 50;

const SEED_COMMENTS = {
  'cobuy-pattern-mining': [
    {
      id: 'cmt_seed_1',
      projectId: 'cobuy-pattern-mining',
      visitorId: 'vis_raziel',
      userName: 'Raziel Sevilla',
      text: 'The association network graph makes interpreting item bundles intuitive. Excellent work!',
      avatar: '💡',
      timestamp: 1792944000000,
      createdAt: '2026-10-25T16:00:00.000Z',
    },
    {
      id: 'cmt_seed_2',
      projectId: 'cobuy-pattern-mining',
      visitorId: 'vis_kier',
      userName: 'Kier',
      text: 'Very impressive thesis project! Can small shops test this with real POS exports?',
      avatar: '📊',
      timestamp: 1792951200000,
      createdAt: '2026-10-25T18:00:00.000Z',
    },
  ],
  'cryptita-plays-builder-workshop': [
    {
      id: 'cmt_seed_3',
      projectId: 'cryptita-plays-builder-workshop',
      visitorId: 'vis_kier',
      userName: 'Kier',
      text: 'The UI responsiveness and interactive layout are super sleek!',
      avatar: '🚀',
      timestamp: 1792945000000,
      createdAt: '2026-10-25T16:15:00.000Z',
    },
  ],
  'personal-portfolio': [
    {
      id: 'cmt_seed_4',
      projectId: 'personal-portfolio',
      visitorId: 'vis_raziel',
      userName: 'Raziel Sevilla',
      text: 'Clean Instagram-inspired design with great micro-interactions. Love the dark mode!',
      avatar: '✨',
      timestamp: 1792946000000,
      createdAt: '2026-10-25T16:30:00.000Z',
    },
  ],
};

async function getComments(req, res, store) {
  const query = getQuery(req);

  // Batch counts request: ?ids=project1,project2
  if (query.ids) {
    const ids = Array.from(
      new Set(
        String(query.ids || '')
          .split(',')
          .map((s) => s.trim())
          .filter(isValidProjectId)
      )
    ).slice(0, MAX_IDS);

    const rawCounts = store ? await store.countComments(ids) : {};
    const counts = {};
    ids.forEach((id) => {
      const seedCount = (SEED_COMMENTS[id] || []).length;
      if (store && typeof rawCounts[id] === 'number' && rawCounts[id] > 0) {
        counts[id] = rawCounts[id];
      } else {
        counts[id] = seedCount;
      }
    });

    return send(res, 200, { success: true, counts });
  }

  // Single project comments list: ?projectId=xyz
  const projectId = query.projectId;
  if (!isValidProjectId(projectId)) {
    throw new HttpError(400, 'Invalid or missing projectId.');
  }

  const stored = store ? await store.listComments(projectId) : [];
  const comments = stored.length > 0 ? stored : (SEED_COMMENTS[projectId] || []);
  return send(res, 200, { success: true, projectId, comments, count: comments.length });
}

async function addComment(req, res, store) {
  const body = getBody(req);
  const { projectId, visitorId, avatar } = body;

  if (!isValidProjectId(projectId)) throw new HttpError(400, 'Invalid projectId.');
  if (!isValidVisitorId(visitorId)) throw new HttpError(400, 'Missing or invalid visitor session.');

  const nameResult = validateDisplayName(body.userName);
  if (!nameResult.ok) throw new HttpError(400, nameResult.error);

  const textResult = validateCommentText(body.text);
  if (!textResult.ok) throw new HttpError(400, textResult.error);

  if (!store) {
    throw new HttpError(503, 'Comment storage is currently unavailable.');
  }

  await enforceRateLimit(store, `cmt:ip:${clientIp(req)}`, 30, 60);

  const comment = {
    id: `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    projectId,
    visitorId,
    userName: nameResult.value,
    text: textResult.value,
    avatar: typeof avatar === 'string' && avatar.trim() ? avatar.trim().slice(0, 10) : '💬',
    timestamp: Date.now(),
    createdAt: new Date().toISOString(),
  };

  await store.insertComment(projectId, comment);
  const comments = await store.listComments(projectId);

  return send(res, 201, {
    success: true,
    comment,
    comments,
    count: comments.length,
  });
}

async function removeComment(req, res, store) {
  const query = getQuery(req);
  const body = getBody(req);
  const projectId = query.projectId || body.projectId;
  const commentId = query.commentId || body.commentId;
  const visitorId = query.visitorId || body.visitorId;

  if (!isValidProjectId(projectId)) throw new HttpError(400, 'Invalid projectId.');
  if (!isValidCommentId(commentId)) throw new HttpError(400, 'Invalid commentId.');

  if (!store) {
    throw new HttpError(503, 'Comment storage is currently unavailable.');
  }

  const isOwner = isOwnerRequest(req);
  const comments = await store.listComments(projectId);
  const target = comments.find((c) => c.id === commentId);

  if (!target) {
    return send(res, 404, { success: false, error: 'Comment not found.' });
  }

  // Allow deletion if requester is owner OR requester is the author (matching visitorId)
  if (!isOwner && (!isValidVisitorId(visitorId) || target.visitorId !== visitorId)) {
    throw new HttpError(403, 'You are not authorized to delete this comment.');
  }

  await store.deleteComment(projectId, commentId);
  const updated = await store.listComments(projectId);

  return send(res, 200, {
    success: true,
    deleted: true,
    projectId,
    count: updated.length,
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
    if (req.method === 'GET') return await getComments(req, res, store);
    if (req.method === 'POST') return await addComment(req, res, store);
    if (req.method === 'DELETE') return await removeComment(req, res, store);
    return methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
  } catch (err) {
    return handleError(res, err, 'comments');
  }
}
