import { describe, expect, it } from 'vitest';
import { SHADOW_HARD, SHADOW_HARD_SM } from '@/styles/shadow';
import { tailwindTheme } from '@/styles/tailwind-theme';
import * as tokens from '@/styles/tokens';
import { MIXED, PALETTE, ROLES } from '@/styles/tokens';

describe('MIXED', () => {
  it('pins the color-mix roles, resolved in OKLCH', () => {
    expect(MIXED).toEqual({
      rule: '#d2ccb7',
      'turf-check': '#9bc7a5',
      'reveal-flash-opponent': '#aaac3b',
      'gate-scrim': '#1f1b1666',
    });
  });
});

describe('ROLES', () => {
  const known = new Set<string>([
    ...Object.values(PALETTE),
    ...Object.values(MIXED),
  ]);

  it('resolves every role to a palette or mixed token', () => {
    for (const [role, value] of Object.entries(ROLES)) {
      expect(known.has(value), role).toBe(true);
    }
  });

  it('keeps the web role values', () => {
    expect(ROLES.surface).toBe(PALETTE.cream);
    expect(ROLES.line).toBe(PALETTE.ink);
    expect(ROLES.you).toBe(PALETTE['duel-blue']);
    expect(ROLES.opponent).toBe(PALETTE['duel-orange']);
    expect(ROLES.turf).toBe(PALETTE.mint);
    expect(ROLES.rule).toBe(MIXED.rule);
  });
});

describe('tailwindTheme', () => {
  const theme = tailwindTheme(tokens);

  it('spaces in points on the 4pt base', () => {
    expect(theme.spacing).toMatchObject({
      '0': '0px',
      '1': '4px',
      '1.75': '7px',
      '4': '16px',
      '96': '384px',
    });
  });

  it('has only the roles as colours', () => {
    expect(Object.keys(theme.colors ?? {}).sort()).toEqual(
      ['transparent', ...Object.keys(ROLES)].sort(),
    );
  });

  it('gives each size its line height', () => {
    expect(theme.fontSize).toMatchObject({
      '16': ['16px', { lineHeight: '24px' }],
      '34': ['34px', { lineHeight: '34px' }],
    });
  });

  it('maps every text size, and nothing else', () => {
    const expected = Object.fromEntries(
      Object.entries(tokens.TEXT_SIZES).map(([size, line]) => [
        size,
        [`${size}px`, { lineHeight: `${line}px` }],
      ]),
    );
    expect(theme.fontSize).toEqual(expected);
  });

  it('keeps a 1px step beside the quarter steps', () => {
    expect(theme.spacing).toMatchObject({ px: '1px', '0.25': '1px' });
  });

  it('rounds corners on the web radii', () => {
    expect(theme.borderRadius).toEqual({
      none: '0px',
      sm: '6px',
      md: '10px',
      lg: '16px',
      full: '9999px',
    });
  });

  it('names each family after its face', () => {
    expect(theme.fontFamily).toEqual({
      body: ['Inter-Regular'],
      'body-medium': ['Inter-Medium'],
      'body-semibold': ['Inter-SemiBold'],
      display: ['ArchivoSemiExpanded-ExtraBold'],
      'display-black': ['ArchivoExpanded-Black'],
      'display-bold': ['Archivo-Bold'],
    });
  });

  // The preset's extend wins: a shared name would lose its face
  it('uses no family name the NativeWind preset claims', () => {
    process.env.NATIVEWIND_OS = 'ios';
    // The preset ships no types, so it is required
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const preset = require('nativewind/preset')();
    const claimed = Object.keys(preset.theme.extend.fontFamily);
    expect(claimed.length).toBeGreaterThan(0);
    for (const name of Object.keys(tokens.FONT_FAMILIES)) {
      expect(claimed, name).not.toContain(name);
    }
  });
});

describe('hard shadows', () => {
  it('sit down and right, in ink, with no blur', () => {
    expect(SHADOW_HARD.boxShadow).toEqual([
      {
        offsetX: 4,
        offsetY: 4,
        blurRadius: 0,
        spreadDistance: 0,
        color: PALETTE.ink,
      },
    ]);
    expect(SHADOW_HARD_SM.boxShadow).toMatchObject([
      { offsetX: 2, offsetY: 2 },
    ]);
  });
});
