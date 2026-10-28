// Shared validation helpers for the portfolio API (used by Vercel functions and the local Express server).

export const LIMITS = Object.freeze({
  name: 40,
  role: 60,
  feedback: 1000,
});

// Control chars, zero-width chars and bidi overrides (except \n, handled separately for feedback).
const UNSAFE_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

/** Single-line text: strips unsafe chars, collapses whitespace, trims and truncates. */
export function cleanLine(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(UNSAFE_CHARS, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Multi-line text: keeps single/double newlines, strips unsafe chars, trims and truncates. */
export function cleanMultiline(value, max) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/\r\n?/g, '\n')
    .replace(UNSAFE_CHARS, ' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

/**
 * Validates a visitor-supplied display name.
 * Returns { ok: true, value } or { ok: false, error }.
 * The name is a display label only — never an identity.
 */
export function validateDisplayName(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'Name is required.' };
  const value = cleanLine(raw, 1000);
  if (!value) return { ok: false, error: 'Name is required.' };
  if (value.length > LIMITS.name) {
    return { ok: false, error: `Name must be ${LIMITS.name} characters or fewer.` };
  }
  if (!/[\p{L}\p{N}]/u.test(value)) {
    return { ok: false, error: 'Name must contain at least one letter or number.' };
  }
  return { ok: true, value };
}

export function isValidVisitorId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{8,80}$/.test(id);
}

export function isValidProjectId(id) {
  return typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(id);
}

export function isValidReviewId(id) {
  return typeof id === 'string' && /^rev_[A-Za-z0-9_]{1,80}$/.test(id);
}

export function isValidCommentId(id) {
  return typeof id === 'string' && /^cmt_[A-Za-z0-9_]{1,80}$/.test(id);
}

export function validateCommentText(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'Comment text is required.' };
  const value = cleanMultiline(raw, 500);
  if (!value) return { ok: false, error: 'Comment text cannot be empty.' };
  if (value.length < 2) return { ok: false, error: 'Comment must be at least 2 characters.' };
  return { ok: true, value };
}

export function parseRating(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
}

export function clampInt(raw, min, max, fallback) {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

