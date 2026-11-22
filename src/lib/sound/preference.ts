export const SOUND_STORAGE_KEY = 'lineup.sound';

const STORED = { on: 'on', off: 'off' } as const;

export type SoundStorage = Pick<Storage, 'getItem' | 'setItem'>;

// Blocked or empty storage means sound on
export function readMuted(storage: SoundStorage | null): boolean {
  try {
    return storage?.getItem(SOUND_STORAGE_KEY) === STORED.off;
  } catch {
    return false;
  }
}

export function writeMuted(
  storage: SoundStorage | null,
  isMuted: boolean,
): void {
  try {
    storage?.setItem(SOUND_STORAGE_KEY, isMuted ? STORED.off : STORED.on);
  } catch {
    // The choice still holds for this page
  }
}

// The device's store, set at startup; tests pass a fake, or none
let storage: SoundStorage | null = null;

export function configureSoundStorage(next: SoundStorage | null): void {
  storage = next;
  muted = null;
}

let muted: boolean | null = null;
const listeners = new Set<() => void>();

export function subscribeMuted(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMuted(): boolean {
  muted ??= readMuted(storage);
  return muted;
}

export function setMuted(isMuted: boolean): void {
  muted = isMuted;
  writeMuted(storage, isMuted);
  listeners.forEach((listener) => listener());
}
