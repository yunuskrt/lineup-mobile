import { describe, expect, it } from 'vitest';
import { TABS } from '@/lib/tabs';

describe('TABS', () => {
  it('names the three tab routes, in order', () => {
    expect(TABS.map((tab) => tab.href)).toEqual([
      '/play',
      '/archive',
      '/profile',
    ]);
  });

  it('keeps each route name in step with its path', () => {
    for (const tab of TABS) expect(tab.href).toBe(`/${tab.name}`);
  });
});
