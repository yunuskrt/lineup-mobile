import { describe, expect, it } from 'vitest';
import { isShortScreen, landsOnWelcome } from '@/lib/welcome';

describe('landsOnWelcome', () => {
  it('shows the welcome only when no session token is stored', () => {
    expect(landsOnWelcome(false)).toBe(true);
    expect(landsOnWelcome(true)).toBe(false);
  });
});

describe('isShortScreen', () => {
  it('trims on an iPhone SE, not on a standard phone', () => {
    expect(isShortScreen(667)).toBe(true);
    expect(isShortScreen(844)).toBe(false);
  });
});
