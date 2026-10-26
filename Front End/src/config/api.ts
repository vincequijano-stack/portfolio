// Central API configuration for backend services.
// - Production (Vercel): '' → same-origin requests to the serverless functions in /api.
// - Local Vite dev: the Express server on :3001 (which runs the same handlers).
// - VITE_API_URL overrides both.
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : '');

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** JSON fetch helper that throws ApiError with the server's message on failure. */
export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    });
  } catch {
    throw new ApiError(0, 'Network error. Please check your connection and try again.');
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok || !data || data.success === false) {
    throw new ApiError(res.status, (data && data.error) || `Request failed (${res.status}).`);
  }
  return data as T;
}
