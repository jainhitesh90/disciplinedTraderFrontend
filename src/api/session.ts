export type AuthSession = {
  token: string;
  name: string | null;
  emailId: string | null;
};

const AUTH_SESSION_KEY = 'auth';

let memorySession: AuthSession | null = null;

function storage(): Storage | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }
  return sessionStorage;
}

export function saveAuthSession(session: AuthSession): void {
  memorySession = session;
  storage()?.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  memorySession = null;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
}

export function readAuthSession(): AuthSession | null {
  if (memorySession?.token) {
    return memorySession;
  }

  const raw = storage()?.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (typeof parsed.token !== 'string' || !parsed.token) {
      return null;
    }
    memorySession = {
      token: parsed.token,
      name: typeof parsed.name === 'string' ? parsed.name : null,
      emailId: typeof parsed.emailId === 'string' ? parsed.emailId : null,
    };
    return memorySession;
  } catch {
    return null;
  }
}
