import { ARC_SPAN } from '@/lib/countdown';

// Fits the thickest stage plus its ink edge, as on web
export const RING_RADIUS = 41;

export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// react-native-svg has no pathLength, so dashes are in user units
export const TRACK_DASH = [RING_CIRCUMFERENCE * ARC_SPAN, RING_CIRCUMFERENCE];

// One dash as long as the circle; the offset sets how much shows
export const ARC_DASH = [RING_CIRCUMFERENCE, RING_CIRCUMFERENCE];

// Linear: time left maps straight onto the arc's length
export function arcDashOffset(fraction: number): number {
  'worklet';
  const clamped = Math.min(Math.max(fraction, 0), 1);
  return RING_CIRCUMFERENCE * (1 - clamped * ARC_SPAN);
}
