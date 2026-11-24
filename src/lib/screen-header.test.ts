import { describe, expect, it } from 'vitest';
import { headerCollapse } from '@/lib/screen-header';

describe('headerCollapse', () => {
  it('is 0 at the top and when pulled down', () => {
    expect(headerCollapse(0, 40)).toBe(0);
    expect(headerCollapse(-60, 40)).toBe(0);
  });

  it('grows with the scroll while the title passes', () => {
    expect(headerCollapse(10, 40)).toBe(0.25);
  });

  it('is 1 once the title has scrolled past, and stays there', () => {
    expect(headerCollapse(40, 40)).toBe(1);
    expect(headerCollapse(400, 40)).toBe(1);
  });

  it('fades the rule over the top gap on a screen with no title', () => {
    expect(headerCollapse(0, 16)).toBe(0);
    expect(headerCollapse(8, 16)).toBe(0.5);
    expect(headerCollapse(16, 16)).toBe(1);
  });

  it('jumps straight to 1 before the title is measured', () => {
    expect(headerCollapse(0, 0)).toBe(0);
    expect(headerCollapse(5, 0)).toBe(1);
  });
});
