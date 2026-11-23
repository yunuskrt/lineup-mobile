import { describe, expect, it } from 'vitest';
import { CANVAS_STATES } from '@/lib/dev/canvas-states';
import { DUEL_GATE_COPY } from '@/lib/duel-session';
import { RECONNECTING_TITLE } from '@/lib/system-states';
import type { DuelCanvasView } from '@/types/canvas';

const NOW = 1_700_000_000_000;

function duelView(name: string): DuelCanvasView {
  const { view } = CANVAS_STATES.duel[name].build(NOW).frame;
  if (view.mode !== 'duel') throw new Error('not a duel');
  return view;
}

describe('the drop dev states (M18b)', () => {
  it('closes to Try again over the board', () => {
    const view = duelView('connection-closed');
    expect(view.gate?.title).toBe('Duel connection closed');
    expect(view.gate?.actionLabel).toBe(DUEL_GATE_COPY.tryAgain);
    expect(view.match).not.toBeNull();
    expect(view.input).toBe('locked');
  });

  it('checks history once back, with no action yet', () => {
    const view = duelView('ended-away');
    expect(view.gate?.title).toBe(DUEL_GATE_COPY.away);
    expect(view.gate?.detail).toBe(DUEL_GATE_COPY.awayChecking);
    expect(view.gate?.actionLabel).toBeUndefined();
    expect(view.turn).toBeNull();
  });

  it('shows the result history gives, with Play again and View profile', () => {
    const gate = duelView('ended-away-found').gate;
    expect(gate?.detail).toBe('You lost. 4 of 11 named.');
    expect(gate?.actionLabel).toBe(DUEL_GATE_COPY.playAgain);
    expect(gate?.secondaryActionLabel).toBe(DUEL_GATE_COPY.viewProfile);
  });

  it('calls the match off with Search again, before any match', () => {
    const view = duelView('called-off');
    expect(view.gate?.title).toBe(DUEL_GATE_COPY.calledOff);
    expect(view.gate?.actionLabel).toBe(DUEL_GATE_COPY.searchAgain);
    expect(view.match).toBeNull();
    expect(view.lobby).toBeNull();
  });

  it('counts down from the deadline in both reconnecting states', () => {
    const yours = duelView('you-reconnecting');
    expect(yours.gate?.title).toBe(RECONNECTING_TITLE);
    expect(yours.gate?.countdown?.deadline).toBeGreaterThan(NOW);
    const theirs = duelView('opponent-reconnecting');
    expect(theirs.opponentConnection?.reconnectDeadline).toBeGreaterThan(NOW);
    expect(theirs.gate).toBeNull();
  });
});
