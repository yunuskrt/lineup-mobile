import { describe, expect, it } from 'vitest';
import { ARC_SPAN } from '@/lib/countdown';
import {
  arcDashOffset,
  RING_CIRCUMFERENCE,
  TRACK_DASH,
} from '@/lib/countdown-arc';

function shownLength(fraction: number): number {
  return RING_CIRCUMFERENCE - arcDashOffset(fraction);
}

describe('arcDashOffset', () => {
  it('shows the whole open arc when the round is full', () => {
    expect(shownLength(1)).toBeCloseTo(RING_CIRCUMFERENCE * ARC_SPAN);
  });

  it('shows nothing when time is up', () => {
    expect(shownLength(0)).toBeCloseTo(0);
  });

  it('maps time left linearly onto the arc', () => {
    expect(shownLength(0.5)).toBeCloseTo(shownLength(1) / 2);
    expect(shownLength(0.2)).toBeCloseTo(shownLength(1) / 5);
  });

  it('clamps fractions outside 0 to 1', () => {
    expect(arcDashOffset(1.4)).toBe(arcDashOffset(1));
    expect(arcDashOffset(-0.3)).toBe(arcDashOffset(0));
  });
});

describe('TRACK_DASH', () => {
  it('draws the same open arc the full sweep does', () => {
    expect(TRACK_DASH[0]).toBeCloseTo(shownLength(1));
  });
});
