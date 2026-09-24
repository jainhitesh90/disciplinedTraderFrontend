const DEFAULT_BASE_URL = 'http://localhost:3000';

export type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
  query?: Record<string, QueryValue>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type InternalRequestOptions = RequestOptions & {
  method: HttpMethod;
  path: string;
  body?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function joinUrl(baseUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

function buildQuery(query: Record<string, QueryValue> | undefined): string {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }
    params.append(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return text;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractMessage(body: unknown): string | null {
  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (!body || typeof body !== 'object') {
    return null;
  }

  const record = body as Record<string, unknown>;
  if (typeof record.message === 'string' && record.message.trim()) {
    return record.message;
  }

  const errorMessage = record.errorMessage;
  if (errorMessage && typeof errorMessage === 'object' && 'message' in errorMessage) {
    const nested = (errorMessage as { message: unknown }).message;
    if (typeof nested === 'string' && nested.trim()) {
      return nested;
    }
  }

  return null;
}

export class ApiClient {
  private accessToken: string | null = null;

  constructor(private readonly baseUrl: string) {}

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: 'GET', path });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: 'POST', path, body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: 'PUT', path, body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: 'PATCH', path, body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...options, method: 'DELETE', path });
  }

  async request<T>(options: InternalRequestOptions): Promise<T> {
    const headers = new Headers(options.headers);

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }
    if (options.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    const url = `${joinUrl(this.baseUrl, options.path)}${buildQuery(options.query)}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method,
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: options.signal,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network request failed';
      throw new ApiError(message, 0, null);
    }

    const body = await parseBody(response);
    if (!response.ok) {
      const message = extractMessage(body) ?? `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, body);
    }

    return body as T;
  }
}

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;

export const api = new ApiClient(baseUrl);
