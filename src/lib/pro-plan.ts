import type { ProPlan, ProRow } from '@/types/pro-plan';
import type { User } from '@/types/user';

// The Free vs Pro rows of project-overview.md, as the web's ROWS
export const PRO_ROWS: ProRow[] = [
  { feature: '1v1 duels', free: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Solo runs', free: '5 a day', pro: 'Unlimited' },
  { feature: 'Pick the exact match', free: null, pro: 'Any match' },
  { feature: 'Archive browse and search', free: null, pro: 'Every match' },
  { feature: 'Practice mode', free: null, pro: 'No clock, no lives' },
  {
    feature: 'Post-game review',
    free: 'How many you missed',
    pro: 'Every player you missed',
  },
  { feature: 'Private rooms', free: 'Join', pro: 'Host and join' },
];

const NOT_INCLUDED = 'Not included';

// One row read aloud: the feature, then its Free and Pro values
export function proRowLabel(row: ProRow): string {
  const free = row.free ?? NOT_INCLUDED;
  const pro = row.pro ?? NOT_INCLUDED;
  return `${row.feature}. Free: ${free}. Pro: ${pro}.`;
}

// The tier is the server's; a session still loading shows neither
export function proPlanOf(isPending: boolean, user: User | null): ProPlan {
  if (isPending) return 'pending';
  return user?.tier === 'pro' ? 'pro' : 'free';
}
