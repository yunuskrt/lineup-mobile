import type { z } from 'zod';
import { getToken, setToken } from '@/lib/api/http/token-store';
import { apiResultSchema } from '@/lib/api/schemas/result';
import type { ApiError, ApiResult } from '@/types/api';

const REQUEST_TIMEOUT_MS = 10_000;

// The backend issues the session token here on sign-in, guest and upgrade
export const AUTH_TOKEN_HEADER = 'set-auth-token';

export const NETWORK_ERROR: ApiError = {
  code: 'network',
  message: "Can't reach Lineup. Check your connection.",
  retryAfterMs: null,
};

export const BAD_RESPONSE_ERROR: ApiError = {
  code: 'server_error',
  message: 'Something went wrong. Try again.',
  retryAfterMs: null,
};

export type HttpMethod = 'GET' | 'POST';

export type QueryValue = string | number | null | undefined;

// no-cache: kept by the browser, asked again by ETag
export type RequestCacheMode = 'no-store' | 'no-cache';

export type RequestOptions = {
  body?: unknown;
  query?: Record<string, QueryValue>;
  cache?: RequestCacheMode;
};

export type Transport = <S extends z.ZodType>(
  method: HttpMethod,
  path: string,
  dataSchema: S,
  options?: RequestOptions,
) => Promise<ApiResult<z.output<S>>>;

function urlOf(baseUrl: string, path: string, query: RequestOptions['query']) {
  const url = new URL(path, baseUrl);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

// Mobile sends a bearer token, never a cookie
function headersOf(hasBody: boolean): Record<string, string> | undefined {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (hasBody) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return Object.keys(headers).length > 0 ? headers : undefined;
}

function initOf(
  method: HttpMethod,
  body: unknown,
  cache: RequestCacheMode,
): RequestInit {
  const hasBody = body !== undefined;
  return {
    method,
    // React Native keeps a cookie jar unless told not to; the bearer rules
    credentials: 'omit',
    cache,
    headers: headersOf(hasBody),
    body: hasBody ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  };
}

// Paths only: a body could hold player data
export function reportDrift(label: string, detail: string[]) {
  if (process.env.NODE_ENV === 'production') return;
  console.error(`[api] ${label}: bad response`, detail);
}

function parseJson(text: string): { value: unknown } | null {
  try {
    return { value: JSON.parse(text) };
  } catch {
    return null;
  }
}

export function createTransport(baseUrl: string): Transport {
  return async function request<S extends z.ZodType>(
    method: HttpMethod,
    path: string,
    dataSchema: S,
    options: RequestOptions = {},
  ): Promise<ApiResult<z.output<S>>> {
    let text: string;
    try {
      const response = await fetch(
        urlOf(baseUrl, path, options.query),
        initOf(method, options.body, options.cache ?? 'no-store'),
      );
      const issued = response.headers.get(AUTH_TOKEN_HEADER);
      if (issued) setToken(issued);
      text = await response.text();
    } catch {
      return { success: false, error: NETWORK_ERROR };
    }

    const json = parseJson(text);
    if (!json) {
      reportDrift(`${method} ${path}`, ['not JSON']);
      return { success: false, error: BAD_RESPONSE_ERROR };
    }

    const parsed = apiResultSchema(dataSchema).safeParse(json.value);
    if (!parsed.success) {
      const paths = parsed.error.issues.map((issue) => issue.path.join('.'));
      reportDrift(`${method} ${path}`, paths);
      return { success: false, error: BAD_RESPONSE_ERROR };
    }

    return parsed.data as ApiResult<z.output<S>>;
  };
}
