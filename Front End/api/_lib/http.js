// Framework-agnostic HTTP helpers. Work with both Vercel Node functions and Express (same req/res API).

import { createHash, timingSafeEqual } from 'crypto';
import { StorageNotConfiguredError } from './store.js';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Cache-Control', 'no-store');
  if (status === 204) return res.end();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function getBody(req) {
  const body = req.body;
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) || {};
    } catch {
      throw new HttpError(400, 'Invalid JSON body.');
    }
  }
  return typeof body === 'object' ? body : {};
}

export function getQuery(req) {
  if (req.query && typeof req.query === 'object') return req.query;
  const url = new URL(req.url || '/', 'http://localhost');
  return Object.fromEntries(url.searchParams.entries());
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim();
  return first || req.socket?.remoteAddress || 'unknown';
}

const digest = (v) => createHash('sha256').update(String(v)).digest();

export function ownerKeyConfigured() {
  return Boolean(process.env.OWNER_KEY && process.env.OWNER_KEY.length >= 12);
}

/** True only when the request carries `Authorization: Bearer <OWNER_KEY>`. */
export function isOwnerRequest(req) {
  if (!ownerKeyConfigured()) return false;
  const header = req.headers.authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return false;
  return timingSafeEqual(digest(match[1].trim()), digest(process.env.OWNER_KEY));
}

export function requireOwner(req) {
  if (!ownerKeyConfigured()) throw new HttpError(503, 'Owner access is not configured on the server.');
  if (!isOwnerRequest(req)) throw new HttpError(401, 'Owner authorization required.');
}

export async function enforceRateLimit(store, key, max, windowSec) {
  const count = await store.hit(key, windowSec);
  if (count > max) throw new HttpError(429, 'Too many requests. Please try again shortly.');
}

export function handleError(res, err, scope) {
  if (err instanceof HttpError) return send(res, err.status, { success: false, error: err.message });
  if (err instanceof StorageNotConfiguredError) {
    console.error(`[api/${scope}] ${err.message}`);
    return send(res, 503, { success: false, error: 'Storage is not configured yet. Please try again later.' });
  }
  console.error(`[api/${scope}] Unexpected error:`, err);
  return send(res, 500, { success: false, error: 'Something went wrong. Please try again.' });
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  return send(res, 405, { success: false, error: 'Method not allowed.' });
}
