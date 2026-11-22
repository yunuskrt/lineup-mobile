import type { CueHapticKind } from '@/types/haptics';
import type { SoundCue } from '@/types/sound';

// Null stays still: a buzz each second would turn the clock into a vibration
export const CUE_HAPTICS: Record<SoundCue, CueHapticKind | null> = {
  correctNew: 'success',
  theirReveal: 'light',
  notInXi: 'warning',
  alreadyNamed: 'light',
  tick: null,
  finalBeep: null,
  lifeLost: 'error',
  theirLifeLost: null,
  turnToYou: 'medium',
  opponentFound: 'success',
  resultWin: 'success',
  resultDraw: 'warning',
  resultLoss: 'error',
  perfectClear: 'success',
  runOver: 'error',
};
