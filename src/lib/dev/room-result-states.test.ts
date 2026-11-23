import { describe, expect, it } from 'vitest';
import { CANVAS_STATES } from '@/lib/dev/canvas-states';
import type { DuelCanvasView } from '@/types/canvas';

const NOW = 1_700_000_000_000;
const ROOM_RESULTS = ['room-result', 'room-result-free'];

function duelView(name: string): DuelCanvasView {
  const { view } = CANVAS_STATES.duel[name].build(NOW).frame;
  if (view.mode !== 'duel') throw new Error('not a duel');
  return view;
}

describe('the room result states (M18a)', () => {
  it.each(ROOM_RESULTS)('%s draws the board with its match', (name) => {
    const view = duelView(name);
    expect(view.match).not.toBeNull();
    expect(view.end).not.toBeNull();
    expect(view.gate).toBeNull();
  });

  it.each(ROOM_RESULTS)('%s is a room game: New room leads', (name) => {
    expect(duelView(name).isPrivate).toBe(true);
  });

  it('shows the pitch the result names', () => {
    const view = duelView('room-result');
    expect(view.found).toEqual(view.end?.found);
  });

  it('keeps a queue result public', () => {
    expect(duelView('result-win').isPrivate).toBeFalsy();
  });
});
