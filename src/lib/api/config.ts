import { z } from 'zod';

// The backend's own max-age on GET /config
export const CONFIG_MAX_AGE_SECONDS = 300;

const API_URL_VAR = 'EXPO_PUBLIC_API_URL';

// Zod runs this even after the URL check fails; Hermes has no canParse
function isOrigin(value: string): boolean {
  try {
    return new URL(value).origin === value;
  } catch {
    return false;
  }
}

const apiUrlSchema = z
  .url({ protocol: /^https?$/, error: 'must be an http(s) URL' })
  .refine(isOrigin, {
    error: 'must be an origin, with no path or trailing slash',
  });

// Throws, so a bad value stops the app at startup
export function resolveApiUrl(
  raw: string | undefined,
  isProduction: boolean,
): string {
  if (!raw) {
    throw new Error(`${API_URL_VAR} is missing. Set it in .env.local.`);
  }

  const parsed = apiUrlSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`${API_URL_VAR} ${parsed.error.issues[0].message}.`);
  }

  if (isProduction && !isSecure(new URL(raw))) {
    throw new Error(`${API_URL_VAR} must use https in production.`);
  }

  return parsed.data;
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

// A release build may still point at a local backend
function isSecure(url: URL): boolean {
  return url.protocol === 'https:' || LOOPBACK_HOSTS.has(url.hostname);
}

export function apiUrl(): string {
  // A direct read, so Expo inlines the value at build time
  return resolveApiUrl(process.env.EXPO_PUBLIC_API_URL, !__DEV__);
}
