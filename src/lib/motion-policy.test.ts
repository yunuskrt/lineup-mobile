import { describe, expect, it } from 'vitest';
import { policyFor } from '@/lib/motion-policy';

describe('policyFor', () => {
  it('runs everything when motion is not reduced', () => {
    const runs = policyFor(false);
    expect(runs('pressShift')).toBe(true);
    expect(runs('inputShake')).toBe(true);
    expect(runs('ringSweep')).toBe(true);
  });

  it('drops movement and keeps information when reduced', () => {
    const runs = policyFor(true);
    expect(runs('pressShift')).toBe(false);
    expect(runs('inputShake')).toBe(false);
    expect(runs('landingEntrance')).toBe(false);
    expect(runs('ringSweep')).toBe(true);
    expect(runs('toastFade')).toBe(true);
  });

  it('animates before the preference is known', () => {
    expect(policyFor(null)('pressShift')).toBe(true);
  });
});
