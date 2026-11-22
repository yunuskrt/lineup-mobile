import { describe, expect, it } from 'vitest';
import { strokeFor } from '@/components/pitch/pitch/styles';
import { ROLES } from '@/styles/tokens';

describe('strokeFor', () => {
  it('draws 2pt ink lines at any pitch width', () => {
    // The view box is 100 wide, so 2pt is 200 / width in its units
    expect(strokeFor(400).strokeWidth).toBe(0.5);
    expect(strokeFor(250).strokeWidth).toBe(0.8);
    expect(strokeFor(400).stroke).toBe(ROLES.line);
  });

  it('draws nothing before the pitch is measured', () => {
    expect(strokeFor(0).strokeWidth).toBe(0);
  });
});
