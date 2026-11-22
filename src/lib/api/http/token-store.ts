export type TokenPersistence = {
  read: () => Promise<string | null>;
  write: (token: string) => Promise<void>;
  remove: () => Promise<void>;
};

let token: string | null = null;
let persistence: TokenPersistence | null = null;

// The device keychain in the app; tests pass a fake, or none
export function configureTokenPersistence(next: TokenPersistence | null) {
  persistence = next;
}

// A keychain that fails to read means a fresh, signed-out start
export async function loadToken(): Promise<void> {
  try {
    token = (await persistence?.read()) ?? null;
  } catch {
    token = null;
  }
}

export function getToken(): string | null {
  return token;
}

export function hasToken(): boolean {
  return token !== null;
}

// Memory first, so the next request has it even if the save fails
export function setToken(next: string): void {
  token = next;
  persistence?.write(next).catch(() => {});
}

export function clearToken(): void {
  token = null;
  persistence?.remove().catch(() => {});
}
