import {
  LANDING_RISE_PX,
  LANDING_STAGGER_MS,
  MOTION_DURATION_MS,
} from '@/styles/motion';

export type EntranceOptions = {
  staggerMs?: number;
  // Crests grow in; everything else rises
  fromScale?: number;
  delayMs?: number;
};

export type EntranceTiming = {
  delayMs: number;
  durationMs: number;
  rise: number;
  fromScale: number | null;
};

// The web's entranceItemProps timing, without the in-view trigger
export function entranceTiming(
  index: number,
  {
    staggerMs = LANDING_STAGGER_MS,
    fromScale,
    delayMs = 0,
  }: EntranceOptions = {},
): EntranceTiming {
  return {
    delayMs: delayMs + index * staggerMs,
    durationMs: MOTION_DURATION_MS.landingRise,
    rise: fromScale === undefined ? LANDING_RISE_PX : 0,
    fromScale: fromScale ?? null,
  };
}
