import { describe, expect, it } from 'vitest';
import { entranceTiming } from '@/lib/entrance';
import {
  LANDING_RISE_PX,
  LANDING_STAGGER_MS,
  MOTION_DURATION_MS,
} from '@/styles/motion';

describe('entranceTiming', () => {
  it('rises in, staggered by index', () => {
    expect(entranceTiming(0)).toEqual({
      delayMs: 0,
      durationMs: MOTION_DURATION_MS.landingRise,
      rise: LANDING_RISE_PX,
      fromScale: null,
    });
    expect(entranceTiming(3).delayMs).toBe(3 * LANDING_STAGGER_MS);
  });

  it('adds a lead delay and a custom stagger', () => {
    expect(entranceTiming(2, { delayMs: 100, staggerMs: 40 }).delayMs).toBe(
      180,
    );
  });

  it('grows in instead of rising when given a scale', () => {
    expect(entranceTiming(0, { fromScale: 0.8 })).toMatchObject({
      rise: 0,
      fromScale: 0.8,
    });
  });
});
