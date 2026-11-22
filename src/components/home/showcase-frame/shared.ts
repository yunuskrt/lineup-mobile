import type { Suggestion } from '@/lib/suggestions';

export const NO_SUGGESTIONS: readonly Suggestion[] = [];

// The still frame's and the skeleton's input: empty and quiet
export const STILL_STAGE = {
  value: '',
  status: 'live',
  shakeKey: 0,
  suggestions: NO_SUGGESTIONS,
  toast: null,
  isFading: false,
} as const;
