import { describe, expect, it } from 'vitest';
import { PRO_ROWS, proPlanOf, proRowLabel } from '@/lib/pro-plan';
import type { User } from '@/types/user';

const FREE_USER = { tier: 'free' } as User;
const PRO_USER = { tier: 'pro' } as User;

describe('PRO_ROWS', () => {
  it('lists the seven Free vs Pro rows of the overview', () => {
    expect(PRO_ROWS.map((row) => row.feature)).toEqual([
      '1v1 duels',
      'Solo runs',
      'Pick the exact match',
      'Archive browse and search',
      'Practice mode',
      'Post-game review',
      'Private rooms',
    ]);
  });

  it('keeps duels unlimited on both plans', () => {
    const duels = PRO_ROWS.find((row) => row.feature === '1v1 duels');
    expect(duels).toEqual({
      feature: '1v1 duels',
      free: 'Unlimited',
      pro: 'Unlimited',
    });
  });

  it('includes every row in Pro', () => {
    expect(PRO_ROWS.every((row) => row.pro !== null)).toBe(true);
  });
});

describe('proRowLabel', () => {
  it('reads the feature, then its Free and Pro values', () => {
    expect(proRowLabel(PRO_ROWS[1])).toBe(
      'Solo runs. Free: 5 a day. Pro: Unlimited.',
    );
  });

  it('reads a missing value as Not included', () => {
    expect(proRowLabel(PRO_ROWS[2])).toBe(
      'Pick the exact match. Free: Not included. Pro: Any match.',
    );
  });
});

describe('proPlanOf', () => {
  it('is pending while the session loads, whatever the user', () => {
    expect(proPlanOf(true, PRO_USER)).toBe('pending');
    expect(proPlanOf(true, null)).toBe('pending');
  });

  it('follows the server tier', () => {
    expect(proPlanOf(false, PRO_USER)).toBe('pro');
    expect(proPlanOf(false, FREE_USER)).toBe('free');
  });

  it('is free with no session', () => {
    expect(proPlanOf(false, null)).toBe('free');
  });
});
