import { describe, expect, it } from 'vitest';
import * as classes from '@/styles/classes';
import { FONT_FAMILIES, ROLES, TEXT_SIZES } from '@/styles/tokens';

// NativeWind drops a class it can't resolve, without an error
const CLASS_STRINGS = Object.entries(classes as Record<string, unknown>).filter(
  (entry): entry is [string, string] => typeof entry[1] === 'string',
);

const KNOWN_PLAIN = new Set(['uppercase']);

function unresolved(className: string): string[] {
  return className.split(/\s+/).filter((token) => {
    if (KNOWN_PLAIN.has(token)) return false;
    if (token.startsWith('font-')) return !(token.slice(5) in FONT_FAMILIES);
    if (token.startsWith('text-')) {
      const value = token.slice(5);
      return !(value in TEXT_SIZES) && !(value in ROLES);
    }
    return true;
  });
}

describe('type roles', () => {
  it('has class strings to check', () => {
    expect(CLASS_STRINGS.length).toBeGreaterThan(5);
  });

  it.each(CLASS_STRINGS)('%s uses only theme values', (_, className) => {
    expect(unresolved(className)).toEqual([]);
  });

  it('flags a family the theme lacks', () => {
    expect(unresolved('font-sans text-12')).toEqual(['font-sans']);
  });
});
