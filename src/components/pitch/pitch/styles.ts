import { ROLES } from '@/styles/tokens';

const VIEW_BOX_WIDTH = 100;
const LINE_PT = 2;

// Ink at 2pt whatever the pitch's drawn width, in view-box units
export function strokeFor(pitchWidth: number) {
  return {
    fill: 'none',
    stroke: ROLES.line,
    strokeWidth: pitchWidth > 0 ? (LINE_PT * VIEW_BOX_WIDTH) / pitchWidth : 0,
  } as const;
}

export const SPOT = { fill: ROLES.line } as const;
