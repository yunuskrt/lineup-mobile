import { describe, expect, it } from 'vitest';
import appConfig from '@/app.json';
import { ROLES } from '@/styles/tokens';

describe('splash screen', () => {
  it('is drawn on the surface colour', () => {
    const splash = appConfig.expo.plugins.find(
      (entry) => Array.isArray(entry) && entry[0] === 'expo-splash-screen',
    );
    const options = Array.isArray(splash) ? splash[1] : undefined;
    const colour =
      options && typeof options === 'object' && 'backgroundColor' in options
        ? String(options.backgroundColor)
        : '';
    expect(colour.toLowerCase()).toBe(ROLES.surface);
  });
});
