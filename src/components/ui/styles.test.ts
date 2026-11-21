import { describe, expect, it } from 'vitest';
import * as kit from '@/components/ui/styles';
import {
  ALERT_TONE,
  AVATAR_TONE,
  BADGE_TONE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  PLATE_OFFSET,
} from '@/components/ui/styles';
import { canDrawBoxShadow } from '@/styles/shadow';
import {
  FONT_FAMILIES,
  ROLES,
  SHADOW_OFFSET,
  SPACING_UNIT,
  TEXT_SIZES,
} from '@/styles/tokens';

// Every class string in styles.ts, flattened from its maps
const KIT_CLASSES = Object.values(kit as Record<string, unknown>).flatMap(
  (value) =>
    typeof value === 'string'
      ? [value]
      : Object.values(value as Record<string, string>),
);

const BORDER_WIDTHS = new Set(['0', '2', '4', '8']);

// Theme-bound tokens only; layout utilities are Tailwind's own
function unresolvedToken(token: string): boolean {
  const [prefix, ...rest] = token.split('-');
  const value = rest.join('-');
  if (prefix === 'font') return !(value in FONT_FAMILIES);
  if (prefix === 'text') return !(value in TEXT_SIZES) && !(value in ROLES);
  if (prefix === 'bg') return !(value in ROLES);
  if (prefix === 'border') {
    return value !== '' && !BORDER_WIDTHS.has(value) && !(value in ROLES);
  }
  return false;
}

describe('kit class strings', () => {
  it('has class strings to check', () => {
    expect(KIT_CLASSES.length).toBeGreaterThan(20);
  });

  it('uses only theme fonts, sizes and colours', () => {
    const tokens = KIT_CLASSES.flatMap((value) => value.split(/\s+/));
    expect(tokens.filter(unresolvedToken)).toEqual([]);
  });

  it('flags a token the theme lacks', () => {
    expect(unresolvedToken('text-fg-mute')).toBe(true);
    expect(unresolvedToken('font-body-semibod')).toBe(true);
    expect(unresolvedToken('border-line')).toBe(false);
  });
});

// A fill class must name a role, or NativeWind drops it silently
function fillRole(className: string): string {
  return className.replace(/^bg-/, '');
}

describe('kit fills', () => {
  it.each([
    ...Object.entries(BADGE_TONE),
    ...Object.entries(BUTTON_VARIANT),
    ...Object.entries(ALERT_TONE),
    ...Object.entries(AVATAR_TONE),
  ])('%s fills with a theme role', (_, className) => {
    expect(className).toMatch(/^bg-/);
    expect(ROLES).toHaveProperty(fillRole(className));
  });
});

describe('PLATE_OFFSET', () => {
  it('sits where SHADOW_HARD does', () => {
    for (const [depth, classes] of Object.entries(PLATE_OFFSET)) {
      const step = Number(/translate-x-([\d.]+)/.exec(classes)?.[1]);
      expect(step * SPACING_UNIT).toBe(
        SHADOW_OFFSET[depth as keyof typeof SHADOW_OFFSET],
      );
      expect(classes).toContain(`translate-y-${step}`);
    }
  });
});

describe('BUTTON_SIZE', () => {
  it('meets the 44pt target, 56pt when large', () => {
    expect(BUTTON_SIZE.default).toContain('h-11');
    expect(BUTTON_SIZE.icon).toContain('h-11 w-11');
    expect(BUTTON_SIZE.large).toContain('h-14');
  });
});

describe('canDrawBoxShadow', () => {
  it('draws on iOS and Android 9 or later', () => {
    expect(canDrawBoxShadow('ios', '17.4')).toBe(true);
    expect(canDrawBoxShadow('android', 28)).toBe(true);
    expect(canDrawBoxShadow('android', 37)).toBe(true);
  });

  it('falls back to the plate on Android 7 and 8', () => {
    expect(canDrawBoxShadow('android', 24)).toBe(false);
    expect(canDrawBoxShadow('android', 27)).toBe(false);
  });
});
