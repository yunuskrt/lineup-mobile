import { describe, expect, it } from 'vitest';
import { discSize, fitPitch, labelSize, slotWidth } from '@/lib/squad-grid';

describe('discSize', () => {
  it.each(['4-4-2', '4-3-3', '3-5-2', '3-4-3'])(
    'gives three-line %s the largest discs',
    (formation) => {
      expect(discSize(formation, 390)).toBeCloseTo(46.8);
    },
  );

  it.each(['4-2-3-1', '4-1-4-1'])(
    'shrinks the discs for four-line %s',
    (formation) => {
      expect(discSize(formation, 390)).toBeCloseTo(31.2);
    },
  );

  it('shrinks them most for five lines', () => {
    expect(discSize('4-1-2-1-2', 390)).toBeCloseTo(25.35);
  });

  it('clamps to the web minimum and maximum', () => {
    expect(discSize('4-4-2', 100)).toBe(28);
    expect(discSize('4-4-2', 1000)).toBe(72);
  });
});

describe('slotWidth', () => {
  it('follows the widest line', () => {
    expect(slotWidth('4-3-3', 400)).toBeCloseTo(88);
    expect(slotWidth('3-5-2', 400)).toBeCloseTo(72);
    expect(slotWidth('3-4-3', 400)).toBeCloseTo(88);
  });

  it('caps the width on a wide pitch', () => {
    expect(slotWidth('4-4-2', 1000)).toBe(160);
  });
});

describe('labelSize', () => {
  it('steps up with the pitch width, as the web does', () => {
    expect(labelSize(340)).toBe(11);
    expect(labelSize(390)).toBe(12);
    expect(labelSize(500)).toBe(14);
  });
});

describe('fitPitch', () => {
  it('fills the width when the box is tall enough', () => {
    expect(fitPitch(300, 600)).toEqual({ width: 300, height: 360 });
  });

  it('fills the height when the box is short', () => {
    expect(fitPitch(600, 300)).toEqual({ width: 250, height: 300 });
  });
});
