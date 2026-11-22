import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearToken,
  configureTokenPersistence,
  getToken,
  hasToken,
  loadToken,
  setToken,
  type TokenPersistence,
} from '@/lib/api/http/token-store';

function fakeKeychain(stored: string | null = null) {
  let value = stored;
  const keychain = {
    read: vi.fn(async () => value),
    write: vi.fn(async (token: string) => {
      value = token;
    }),
    remove: vi.fn(async () => {
      value = null;
    }),
  } satisfies TokenPersistence;
  return keychain;
}

describe('token store', () => {
  afterEach(() => {
    clearToken();
    configureTokenPersistence(null);
  });

  it('loads a saved token at boot', async () => {
    configureTokenPersistence(fakeKeychain('saved.token'));
    await loadToken();
    expect(getToken()).toBe('saved.token');
    expect(hasToken()).toBe(true);
  });

  it('starts signed out when nothing is saved', async () => {
    configureTokenPersistence(fakeKeychain());
    await loadToken();
    expect(getToken()).toBeNull();
    expect(hasToken()).toBe(false);
  });

  it('reads a failing keychain as no token, never a crash', async () => {
    const keychain = fakeKeychain('saved.token');
    keychain.read.mockRejectedValueOnce(new Error('locked'));
    configureTokenPersistence(keychain);
    await expect(loadToken()).resolves.toBeUndefined();
    expect(getToken()).toBeNull();
  });

  it('saves a new token, and deletes it on clear', () => {
    const keychain = fakeKeychain();
    configureTokenPersistence(keychain);
    setToken('fresh.token');
    expect(getToken()).toBe('fresh.token');
    expect(keychain.write).toHaveBeenCalledWith('fresh.token');
    clearToken();
    expect(getToken()).toBeNull();
    expect(keychain.remove).toHaveBeenCalledOnce();
  });

  it('keeps the token in memory when the keychain fails to save', () => {
    const keychain = fakeKeychain();
    keychain.write.mockRejectedValueOnce(new Error('full'));
    configureTokenPersistence(keychain);
    setToken('fresh.token');
    expect(getToken()).toBe('fresh.token');
  });
});
