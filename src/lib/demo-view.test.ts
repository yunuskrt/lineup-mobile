import { describe, expect, it } from 'vitest';
import { isHalfInView } from '@/lib/demo-view';

const FRAME = { top: 600, height: 400 };
const VIEWPORT = 700;

describe('isHalfInView', () => {
  it('plays with the whole frame in view', () => {
    expect(isHalfInView(FRAME, 400, VIEWPORT)).toBe(true);
  });

  it('plays with exactly half in view, below the fold', () => {
    expect(isHalfInView(FRAME, 100, VIEWPORT)).toBe(true);
  });

  it('stops with less than half in view, below the fold', () => {
    expect(isHalfInView(FRAME, 99, VIEWPORT)).toBe(false);
  });

  it('stops once more than half has scrolled off the top', () => {
    expect(isHalfInView(FRAME, 801, VIEWPORT)).toBe(false);
    expect(isHalfInView(FRAME, 800, VIEWPORT)).toBe(true);
  });

  it('stops with the frame far off screen', () => {
    expect(isHalfInView(FRAME, 2000, VIEWPORT)).toBe(false);
  });

  it('stops before anything is measured', () => {
    expect(isHalfInView({ top: 0, height: 0 }, 0, VIEWPORT)).toBe(false);
    expect(isHalfInView(FRAME, 0, 0)).toBe(false);
  });

  it('plays a frame taller than the viewport while it fills half of it', () => {
    expect(isHalfInView({ top: 0, height: 1000 }, 0, 600)).toBe(true);
  });
});
