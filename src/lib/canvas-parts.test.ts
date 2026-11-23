import { describe, expect, it } from 'vitest';
import { gateSize, laterPartLine } from '@/lib/canvas-parts';
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

describe('laterPartLine', () => {
  it('says which phase builds it', () => {
    expect(laterPartLine({ phase: 'M21', name: 'update screen' })).toBe(
      'Built in M21: the update screen.',
    );
  });
});
