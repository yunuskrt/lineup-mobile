import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRO_STATE,
  PRO_STATES,
  resolveProState,
} from '@/lib/dev/pro-states';

describe('PRO_STATES', () => {
  it('offers free, pro, pending and error', () => {
    expect(Object.keys(PRO_STATES)).toEqual([
      'free',
      'pro',
      'pending',
      'error',
    ]);
  });

  it('gives the error state a message to show', () => {
    const error = PRO_STATES.error;
    expect(error.status === 'error' && error.message.length > 0).toBe(true);
  });
});

describe('resolveProState', () => {
  it('returns the named state', () => {
    expect(resolveProState('pro')).toBe(PRO_STATES.pro);
    expect(resolveProState('error')).toBe(PRO_STATES.error);
  });

  it('falls back to the default for an unknown or repeated param', () => {
    const fallback = PRO_STATES[DEFAULT_PRO_STATE];
    expect(resolveProState('nope')).toBe(fallback);
    expect(resolveProState(['pro', 'free'])).toBe(fallback);
    expect(resolveProState(undefined)).toBe(fallback);
  });

  it('ignores inherited names', () => {
    expect(resolveProState('toString')).toBe(PRO_STATES[DEFAULT_PRO_STATE]);
  });
});
