export type AuthSession = {
  token: string;
  name: string | null;
  emailId: string | null;
};

const AUTH_SESSION_KEY = 'auth';

function storage(): Storage | null {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }
  return sessionStorage;
}

export function saveAuthSession(session: AuthSession): void {
  storage()?.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function readAuthSession(): AuthSession | null {
  const raw = storage()?.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (typeof parsed.token !== 'string' || !parsed.token) {
      return null;
    }
    return {
      token: parsed.token,
      name: typeof parsed.name === 'string' ? parsed.name : null,
      emailId: typeof parsed.emailId === 'string' ? parsed.emailId : null,
    };
  } catch {
    return null;
  }
}
