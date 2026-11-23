import { describe, expect, it } from 'vitest';
import {
  gateSize,
  laterGatePart,
  laterPartLine,
  laterRailPart,
} from '@/lib/canvas-parts';
import { CANVAS_STATES } from '@/lib/dev/canvas-states';
import type { CanvasMode, CanvasView } from '@/types/canvas';

const NOW = 1_700_000_000_000;

function viewOf(mode: CanvasMode, name: string): CanvasView {
  return CANVAS_STATES[mode][name].build(NOW).frame.view;
}

describe('gateSize', () => {
  it('keeps a plain gate narrow', () => {
    expect(gateSize(viewOf('solo', 'pre-match'))).toBe('narrow');
  });

  it('widens the side pick', () => {
    expect(gateSize(viewOf('solo', 'side-pick'))).toBe('wide');
  });

  it('sizes the lobby by its step', () => {
    expect(gateSize(viewOf('duel', 'searching'))).toBe('narrow');
    expect(gateSize(viewOf('duel', 'filters'))).toBe('wide');
  });
});

describe('laterGatePart', () => {
  it('names the room steps, still ahead', () => {
    expect(laterGatePart(viewOf('duel', 'room-waiting'))?.phase).toBe('M17b');
    expect(laterGatePart(viewOf('duel', 'room-expired'))?.phase).toBe('M17b');
  });

  it('names nothing for a gate the board draws itself', () => {
    expect(laterGatePart(viewOf('solo', 'side-pick'))).toBeNull();
    expect(laterGatePart(viewOf('solo', 'pre-match'))).toBeNull();
    expect(laterGatePart(viewOf('duel', 'you-reconnecting'))).toBeNull();
    expect(laterGatePart(viewOf('duel', 'paired'))).toBeNull();
  });
});

describe('laterRailPart', () => {
  it('names nothing once a solo run ends: the summary is drawn', () => {
    expect(laterRailPart(viewOf('solo', 'run-over'))).toBeNull();
    expect(laterRailPart(viewOf('solo', 'summary-loading'))).toBeNull();
  });

  it('names the duel result once a duel ends', () => {
    expect(laterRailPart(viewOf('duel', 'result-win'))?.phase).toBe('M18');
  });

  it('names nothing mid-game', () => {
    expect(laterRailPart(viewOf('solo', 'idle'))).toBeNull();
    expect(laterRailPart(viewOf('duel', 'their-turn'))).toBeNull();
  });
});

describe('laterPartLine', () => {
  it('says which phase builds it', () => {
    expect(laterPartLine({ phase: 'M18', name: 'duel result' })).toBe(
      'Built in M18: the duel result.',
    );
  });
});
