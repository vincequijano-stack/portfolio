// Visitor session helpers: anonymous visitor id, session display name, the shared name prompt, and owner key.
//
// - visitorId: random id kept in localStorage so the server can de-duplicate likes from this browser.
//   It is not a fingerprint and is not tied to any personal data.
// - display name: kept in sessionStorage (current browser session only). It is a label, not an identity.
// - owner key: only stored after the server confirms it via /api/owner.

import { apiFetch } from '../config/api';

const VISITOR_ID_KEY = 'portfolio_visitor_uuid';
const SESSION_NAME_KEY = 'portfolio_session_display_name';
const OWNER_KEY_STORAGE = 'portfolio_owner_key';

export const NAME_MAX_LENGTH = 40;
export const NAME_CHANGED_EVENT = 'portfolio_visitor_name_changed';
export const OWNER_CHANGED_EVENT = 'portfolio_owner_status_changed';

// ── Visitor id ────────────────────────────────────────────────
function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `vis_${crypto.randomUUID().replace(/-/g, '')}`;
    }
  } catch {}
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `vis_${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`;
}

let memoryVisitorId: string | null = null;

export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing && /^[A-Za-z0-9_-]{8,80}$/.test(existing)) return existing;
    const id = randomId();
    localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    // Storage blocked (e.g. strict privacy mode): fall back to an in-memory id for this page view.
    memoryVisitorId = memoryVisitorId || randomId();
    return memoryVisitorId;
  }
}

// ── Display name ──────────────────────────────────────────────
export function validateDisplayName(raw: string): { ok: true; value: string } | { ok: false; error: string } {
  const value = (raw || '')
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!value) return { ok: false, error: 'Please enter your name.' };
  if (value.length > NAME_MAX_LENGTH) {
    return { ok: false, error: `Name must be ${NAME_MAX_LENGTH} characters or fewer.` };
  }
  if (!/[\p{L}\p{N}]/u.test(value)) return { ok: false, error: 'Name must contain at least one letter or number.' };
  return { ok: true, value };
}

let memoryName = '';

export function getSessionName(): string {
  try {
    return sessionStorage.getItem(SESSION_NAME_KEY) || '';
  } catch {
    return memoryName;
  }
}

export function setSessionName(name: string): void {
  memoryName = name;
  try {
    sessionStorage.setItem(SESSION_NAME_KEY, name);
  } catch {}
  window.dispatchEvent(new CustomEvent(NAME_CHANGED_EVENT, { detail: name }));
}

// ── Shared name prompt ────────────────────────────────────────
// Components call requestVisitorName(); <VisitorNamePromptHost/> (mounted once in App) renders the modal.
type PromptRequest = { initialName: string; resolve: (name: string | null) => void };
type PromptListener = (req: PromptRequest | null) => void;

let activeRequest: PromptRequest | null = null;
const promptListeners = new Set<PromptListener>();

export function subscribeToNamePrompt(listener: PromptListener): () => void {
  promptListeners.add(listener);
  listener(activeRequest);
  return () => promptListeners.delete(listener);
}

function emitPrompt() {
  promptListeners.forEach((l) => l(activeRequest));
}

/** Opens the "Before You Interact" modal. Resolves with the saved name, or null if cancelled. */
export function requestVisitorName(options: { force?: boolean } = {}): Promise<string | null> {
  const current = getSessionName();
  if (current && !options.force) return Promise.resolve(current);
  if (activeRequest) activeRequest.resolve(null);
  return new Promise((resolve) => {
    activeRequest = {
      initialName: current,
      resolve: (name) => {
        activeRequest = null;
        emitPrompt();
        if (name) setSessionName(name);
        resolve(name);
      },
    };
    emitPrompt();
  });
}

/** Returns the session name, prompting the visitor only if none is set yet. */
export function ensureVisitorName(): Promise<string | null> {
  return requestVisitorName();
}

// ── Owner key ─────────────────────────────────────────────────
export function getOwnerKey(): string {
  try {
    return localStorage.getItem(OWNER_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function isOwnerUnlocked(): boolean {
  return Boolean(getOwnerKey());
}

export function ownerAuthHeaders(): Record<string, string> {
  const key = getOwnerKey();
  return key ? { Authorization: `Bearer ${key}` } : {};
}

/** Verifies the key with the server before storing it. */
export async function unlockOwner(key: string): Promise<void> {
  const clean = key.trim();
  await apiFetch('/api/owner', { headers: { Authorization: `Bearer ${clean}` } });
  try {
    localStorage.setItem(OWNER_KEY_STORAGE, clean);
  } catch {}
  window.dispatchEvent(new CustomEvent(OWNER_CHANGED_EVENT, { detail: true }));
}

export function lockOwner(): void {
  try {
    localStorage.removeItem(OWNER_KEY_STORAGE);
  } catch {}
  window.dispatchEvent(new CustomEvent(OWNER_CHANGED_EVENT, { detail: false }));
}
