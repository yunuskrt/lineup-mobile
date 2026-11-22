import { parseFormation } from '@/lib/formation';

type DiscRule = { min: number; share: number; max: number };

// The web's clamp(min, share of the pitch width, max), in points
const DISC_BY_LINE_COUNT: Record<3 | 4 | 5, DiscRule> = {
  3: { min: 28, share: 0.12, max: 72 },
  4: { min: 20, share: 0.08, max: 56 },
  5: { min: 18, share: 0.065, max: 40 },
};

// Each width stays under the line spacing slotLayout uses
const SLOT_SHARE_BY_WIDEST_LINE: Record<number, number> = {
  3: 0.24,
  4: 0.22,
  5: 0.18,
};
const SLOT_SHARE_CROWDED = 0.14;
const SLOT_MAX = 160;

// The pitch is 5 wide to 6 tall
const PITCH_RATIO = 5 / 6;

function lineCountRule(formation: string): DiscRule {
  const lineCount = (parseFormation(formation) ?? []).length;
  if (lineCount <= 3) return DISC_BY_LINE_COUNT[3];
  return DISC_BY_LINE_COUNT[lineCount >= 5 ? 5 : 4];
}

// More lines, smaller discs, so disc and label fit each row
export function discSize(formation: string, pitchWidth: number): number {
  const { min, share, max } = lineCountRule(formation);
  return Math.min(max, Math.max(min, share * pitchWidth));
}

export function slotWidth(formation: string, pitchWidth: number): number {
  const widestLine = Math.max(...(parseFormation(formation) ?? []));
  const share =
    widestLine <= 3
      ? SLOT_SHARE_BY_WIDEST_LINE[3]
      : (SLOT_SHARE_BY_WIDEST_LINE[widestLine] ?? SLOT_SHARE_CROWDED);
  return Math.min(SLOT_MAX, share * pitchWidth);
}

// The web's label steps, by the pitch's own width
export function labelSize(pitchWidth: number): number {
  if (pitchWidth < 360) return 11;
  if (pitchWidth < 480) return 12;
  return 14;
}

// The largest 5:6 pitch that fits the box
export function fitPitch(
  boxWidth: number,
  boxHeight: number,
): { width: number; height: number } {
  const width = Math.min(boxWidth, boxHeight * PITCH_RATIO);
  return { width, height: width / PITCH_RATIO };
}
