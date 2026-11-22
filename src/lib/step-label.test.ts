import { describe, expect, it } from 'vitest';
import { stepLabel } from '@/lib/step-label';

describe('stepLabel', () => {
  it('reads the current step with its place', () => {
    expect(
      stepLabel({ index: 0, name: 'Mode', isCurrent: true, isDone: false }),
    ).toBe('Step 1 of 3, Mode, current');
  });

  it('reads a filled step with its choice', () => {
    expect(
      stepLabel({
        index: 0,
        name: 'Mode',
        choice: 'Solo',
        isCurrent: false,
        isDone: true,
      }),
    ).toBe('Step 1 of 3, Mode, Solo, done');
  });

  it('reads the current step as current even once filled', () => {
    expect(
      stepLabel({
        index: 0,
        name: 'Mode',
        choice: 'Duel',
        isCurrent: true,
        isDone: true,
      }),
    ).toBe('Step 1 of 3, Mode, Duel, current');
  });

  it('reads a step not reached by name alone', () => {
    expect(
      stepLabel({ index: 2, name: 'Start', isCurrent: false, isDone: false }),
    ).toBe('Step 3 of 3, Start');
  });
});
