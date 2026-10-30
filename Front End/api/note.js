// /api/note — persistent owner profile note (visible to all visitors).
//   GET  → { success: true, note: '...', timestamp }
//   POST { note } → saves the new owner note in the database and returns it

import { getStore } from './_lib/store.js';
import {
  send,
  getBody,
  clientIp,
  enforceRateLimit,
  handleError,
  methodNotAllowed,
  HttpError,
} from './_lib/http.js';

const DEFAULT_NOTE = 'LF OJT';
const MAX_NOTE_LENGTH = 50;

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, {});

    let store = null;
    try {
      store = getStore();
    } catch {
      store = null;
    }

    if (req.method === 'GET') {
      const saved = store && store.getNote ? await store.getNote() : null;
      return send(res, 200, {
        success: true,
        note: saved?.note || DEFAULT_NOTE,
        timestamp: saved?.timestamp || 0,
      });
    }

    if (req.method === 'POST') {
      const body = getBody(req);
      const raw = typeof body.note === 'string' ? body.note.trim() : '';
      const clean = (raw || DEFAULT_NOTE).slice(0, MAX_NOTE_LENGTH);

      if (!store || !store.setNote) {
        return send(res, 200, {
          success: true,
          note: clean,
          timestamp: Date.now(),
        });
      }

      await enforceRateLimit(store, `note:ip:${clientIp(req)}`, 30, 60);
      const payload = { note: clean, timestamp: Date.now() };
      await store.setNote(payload);

      return send(res, 200, {
        success: true,
        note: payload.note,
        timestamp: payload.timestamp,
      });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (err) {
    return handleError(res, err, 'note');
  }
}
