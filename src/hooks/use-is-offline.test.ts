import { onlineManager } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { announceOfflineOnce } from '@/hooks/use-is-offline';

const announce = vi.hoisted(() => vi.fn());

vi.mock('react-native', () => ({
  AccessibilityInfo: { announceForAccessibility: announce },
}));

const LINE = 'You’re offline.';

describe('announceOfflineOnce', () => {
  beforeEach(() => {
    onlineManager.setOnline(true);
    announce.mockClear();
  });

  afterEach(() => {
    onlineManager.setOnline(true);
  });

  it('reads the line once however many notices ask', () => {
    onlineManager.setOnline(false);
    announceOfflineOnce(LINE);
    announceOfflineOnce(LINE);
    announceOfflineOnce(LINE);
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenCalledWith(LINE);
  });

  it('reads it again after the connection comes back and drops', () => {
    onlineManager.setOnline(false);
    announceOfflineOnce(LINE);
    onlineManager.setOnline(true);
    onlineManager.setOnline(false);
    announceOfflineOnce(LINE);
    expect(announce).toHaveBeenCalledTimes(2);
  });

  it('stays quiet within one drop, even after a notice remounts', () => {
    onlineManager.setOnline(false);
    announceOfflineOnce(LINE);
    onlineManager.setOnline(false);
    announceOfflineOnce(LINE);
    expect(announce).toHaveBeenCalledTimes(1);
  });
});
