import { z } from 'zod';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH_TOKEN_HEADER, createTransport } from '@/lib/api/http/transport';
import { clearToken, getToken, setToken } from '@/lib/api/http/token-store';

const OK = '{"success":true,"data":{"name":"a"}}';
const dataSchema = z.object({ name: z.string() });
const fetchMock = vi.fn<typeof fetch>();

function headersOfLastCall(): Record<string, string> | undefined {
  const init = fetchMock.mock.calls.at(-1)?.[1];
  return init?.headers as Record<string, string> | undefined;
}

describe('createTransport and the session token', () => {
  const request = createTransport('http://localhost:8080');

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    clearToken();
  });

  it('sends the stored token as a bearer header', async () => {
    setToken('abc.def');
    fetchMock.mockResolvedValueOnce(new Response(OK));
    await request('GET', '/profile', dataSchema);
    expect(headersOfLastCall()).toEqual({ Authorization: 'Bearer abc.def' });
  });

  it('keeps the bearer header beside a JSON body', async () => {
    setToken('abc.def');
    fetchMock.mockResolvedValueOnce(new Response(OK));
    await request('POST', '/solo/sessions', dataSchema, { body: {} });
    expect(headersOfLastCall()).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer abc.def',
    });
  });

  it('sends no authorization without a token', async () => {
    fetchMock.mockResolvedValueOnce(new Response(OK));
    await request('GET', '/config', dataSchema);
    expect(headersOfLastCall()).toBeUndefined();
  });

  it('stores the token a response issues', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(OK, { headers: { [AUTH_TOKEN_HEADER]: 'new.token' } }),
    );
    await request('POST', '/auth/guest', dataSchema);
    expect(getToken()).toBe('new.token');
  });

  it('leaves the token alone when a response issues none', async () => {
    setToken('kept.token');
    fetchMock.mockResolvedValueOnce(new Response(OK));
    await request('GET', '/auth/session', dataSchema);
    expect(getToken()).toBe('kept.token');
  });
});
