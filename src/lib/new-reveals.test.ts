import { describe, expect, it } from 'vitest';
import { newRevealIds } from '@/lib/new-reveals';

const A = { id: 'a' };
const B = { id: 'b' };
const C = { id: 'c' };

describe('newRevealIds', () => {
  it('names the player that just arrived', () => {
    expect([...newRevealIds([A], [A, B], false)]).toEqual(['b']);
  });

  it('names two that arrive together', () => {
    expect([...newRevealIds([A], [A, B, C], false)]).toEqual(['b', 'c']);
  });

  it('names none when nothing arrived', () => {
    expect(newRevealIds([A, B], [A, B], false).size).toBe(0);
  });

  it('names none for a snapshot, however many there are', () => {
    expect(newRevealIds([], [A, B, C], true).size).toBe(0);
  });

  it('starts over after a reset', () => {
    expect(newRevealIds([A, B], [], false).size).toBe(0);
    expect([...newRevealIds([], [C], false)]).toEqual(['c']);
  });
});
