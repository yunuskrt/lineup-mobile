import { describe, expect, it } from 'vitest';
import { CUE_HAPTICS } from '@/lib/cue-haptics';
import { SOUND_CUES } from '@/styles/sound';
import type { SoundCue } from '@/types/sound';

describe('CUE_HAPTICS', () => {
  it('has a row for every sound cue, and only those', () => {
    expect(Object.keys(CUE_HAPTICS).sort()).toEqual(
      Object.keys(SOUND_CUES).sort(),
    );
  });

  it('keeps the clock still: no buzz for a tick or a beep', () => {
    expect(CUE_HAPTICS.tick).toBeNull();
    expect(CUE_HAPTICS.finalBeep).toBeNull();
  });

  it('feels a find, a miss and a lost life apart', () => {
    expect(CUE_HAPTICS.correctNew).toBe('success');
    expect(CUE_HAPTICS.notInXi).toBe('warning');
    expect(CUE_HAPTICS.lifeLost).toBe('error');
  });

  it("leaves the opponent's lost life unfelt: it isn't your loss", () => {
    expect(CUE_HAPTICS.theirLifeLost).toBeNull();
  });

  it('matches each result to its outcome', () => {
    const results: [SoundCue, string][] = [
      ['resultWin', 'success'],
      ['perfectClear', 'success'],
      ['resultDraw', 'warning'],
      ['resultLoss', 'error'],
      ['runOver', 'error'],
    ];
    for (const [cue, kind] of results) expect(CUE_HAPTICS[cue]).toBe(kind);
  });
});
