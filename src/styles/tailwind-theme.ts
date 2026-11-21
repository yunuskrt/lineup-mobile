import type { Config } from 'tailwindcss';
import type * as Tokens from '@/styles/tokens';

type TokenModule = typeof Tokens;

type FontSize = [string, { lineHeight: string }];

// Quarter steps to 96, as on web: `p-4` is 16pt, `py-1.75` is 7pt
const SPACING_STEPS = 384;

function spacingScale(unit: number): Record<string, string> {
  const scale: Record<string, string> = { px: '1px' };
  for (let step = 0; step <= SPACING_STEPS; step += 1) {
    const key = step / 4;
    scale[String(key)] = `${key * unit}px`;
  }
  return scale;
}

function px(value: number): string {
  return `${value}px`;
}

// Tokens are passed in, so the config can load this without @/
export function tailwindTheme({
  ROLES,
  SPACING_UNIT,
  RADIUS,
  TEXT_SIZES,
  FONT_FAMILIES,
}: TokenModule): NonNullable<Config['theme']> {
  return {
    colors: { transparent: 'transparent', ...ROLES },
    spacing: spacingScale(SPACING_UNIT),
    borderRadius: {
      none: '0px',
      sm: px(RADIUS.sm),
      md: px(RADIUS.md),
      lg: px(RADIUS.lg),
      full: px(RADIUS.full),
    },
    fontSize: Object.fromEntries(
      Object.entries(TEXT_SIZES).map(
        ([size, lineHeight]): [string, FontSize] => [
          size,
          [px(Number(size)), { lineHeight: px(lineHeight) }],
        ],
      ),
    ),
    fontFamily: Object.fromEntries(
      Object.entries(FONT_FAMILIES).map(([name, face]) => [name, [face]]),
    ),
  };
}
