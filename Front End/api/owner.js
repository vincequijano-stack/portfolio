// /api/owner — verifies the owner key (Authorization: Bearer <OWNER_KEY>). Used to unlock owner-only views.

import { send, isOwnerRequest, ownerKeyConfigured, methodNotAllowed } from './_lib/http.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!ownerKeyConfigured()) {
    return send(res, 503, { success: false, error: 'Owner access is not configured on the server.' });
  }
  if (!isOwnerRequest(req)) return send(res, 401, { success: false, error: 'Invalid owner key.' });
  return send(res, 200, { success: true });
}
