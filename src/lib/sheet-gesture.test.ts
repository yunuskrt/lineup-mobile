import { describe, expect, it } from 'vitest';
import {
  DISMISS_DISTANCE,
  DISMISS_VELOCITY,
  shouldDismiss,
} from '@/lib/sheet-gesture';

describe('shouldDismiss', () => {
  it('keeps the sheet for a short, slow drag', () => {
    expect(shouldDismiss(40, 200)).toBe(false);
    expect(shouldDismiss(DISMISS_DISTANCE, DISMISS_VELOCITY)).toBe(false);
  });

  it('closes past the distance, however slow', () => {
    expect(shouldDismiss(DISMISS_DISTANCE + 1, 0)).toBe(true);
  });

  it('closes on a fast flick, however short', () => {
    expect(shouldDismiss(10, DISMISS_VELOCITY + 1)).toBe(true);
  });

  it('never closes on a drag upward', () => {
    expect(shouldDismiss(-300, -2000)).toBe(false);
  });
});
