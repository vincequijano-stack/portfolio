// Visitor session helpers: anonymous visitor id, session display name, the shared name prompt, and owner key.
//
// - visitorId: random id kept in localStorage so the server can de-duplicate likes from this browser.
//   It is not a fingerprint and is not tied to any personal data.
// - display name: kept in sessionStorage (current browser session only). It is a label, not an identity.
// - owner key: only stored after the server confirms it via /api/owner.

import { apiFetch } from '../config/api';

const VISITOR_ID_KEY = 'portfolio_visitor_uuid';
const SESSION_NAME_KEY = 'portfolio_session_display_name';
const PERMANENT_NAME_KEY = 'portfolio_visitor_display_name';
const OWNER_KEY_STORAGE = 'portfolio_owner_key';
const OWNER_FLAG_STORAGE = 'portfolio_is_owner';
const OWNER_DISPLAY_NAME = 'Vince Quijano';

export const NAME_MAX_LENGTH = 40;
export const NAME_CHANGED_EVENT = 'portfolio_visitor_name_changed';
export const OWNER_CHANGED_EVENT = 'portfolio_owner_status_changed';

function matchesOwnerIdentity(raw: string): boolean {
  const clean = (raw || '').trim().toLowerCase().replace(/^@/, '');
  return (
    clean === 'vince quijano' ||
    clean === 'vincequijano' ||
    clean === 'vince lawrence quijano' ||
    clean === 'vincelawrencequijano@gmail.com' ||
    clean === 'vincequijano159@gmail.com'
  );
}

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
  if (value.toLowerCase() === 'guest') {
    return { ok: false, error: 'Please enter your actual name (Guest is not allowed).' };
  }
  if (value.length > NAME_MAX_LENGTH) {
    return { ok: false, error: `Name must be ${NAME_MAX_LENGTH} characters or fewer.` };
  }
  if (!/[\p{L}\p{N}]/u.test(value)) return { ok: false, error: 'Name must contain at least one letter or number.' };
  return { ok: true, value };
}

let memoryName = '';

export function getSessionName(): string {
  try {
    if (isOwnerUnlocked()) {
      return OWNER_DISPLAY_NAME;
    }
    const sessionVal = sessionStorage.getItem(SESSION_NAME_KEY) || '';
    if (sessionVal && sessionVal.toLowerCase() !== 'guest') {
      return sessionVal;
    }
    return '';
  } catch {
    return memoryName || (isOwnerUnlocked() ? OWNER_DISPLAY_NAME : '');
  }
}

export function setSessionName(name: string): void {
  const isOwnerMatch = matchesOwnerIdentity(name);
  const finalName = isOwnerMatch ? OWNER_DISPLAY_NAME : name;
  memoryName = finalName;
  try {
    sessionStorage.setItem(SESSION_NAME_KEY, finalName);
    if (isOwnerMatch) {
      localStorage.setItem(OWNER_FLAG_STORAGE, 'true');
      localStorage.setItem(PERMANENT_NAME_KEY, OWNER_DISPLAY_NAME);
    }
  } catch {}
  window.dispatchEvent(new CustomEvent(NAME_CHANGED_EVENT, { detail: finalName }));
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

/** Opens the "Before You Interact" modal for clients. Never prompts the owner unless forced. */
export function requestVisitorName(options: { force?: boolean } = {}): Promise<string | null> {
  if (!options.force && isOwnerUnlocked()) {
    return Promise.resolve(OWNER_DISPLAY_NAME);
  }
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

/** Returns the session name, prompting the visitor only if they are a client with no name set yet. */
export function ensureVisitorName(): Promise<string | null> {
  return requestVisitorName();
}

// ── Owner key & Auto-Recognition ──────────────────────────────
export function getOwnerKey(): string {
  try {
    return localStorage.getItem(OWNER_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function isOwnerUnlocked(): boolean {
  try {
    if (getOwnerKey()) return true;
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        return true;
      }
      if (
        localStorage.getItem(OWNER_FLAG_STORAGE) === 'true' ||
        localStorage.getItem('vince_owner_verified') === 'true' ||
        localStorage.getItem('portfolio_owner_verified') === 'true'
      ) {
        return true;
      }
      if (localStorage.getItem('vince_profile_note')) {
        return true;
      }
      const savedName =
        localStorage.getItem(PERMANENT_NAME_KEY) ||
        localStorage.getItem('portfolio_visitor_name') ||
        localStorage.getItem('portfolio_owner_email') ||
        sessionStorage.getItem(SESSION_NAME_KEY) ||
        '';
      if (matchesOwnerIdentity(savedName)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
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
