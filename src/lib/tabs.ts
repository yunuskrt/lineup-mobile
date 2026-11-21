import type { TabItem } from '@/types/navigation';

// The bottom tabs, left to right; the web's nav destinations
export const TABS: readonly TabItem[] = [
  { name: 'play', href: '/play', label: 'Play' },
  { name: 'archive', href: '/archive', label: 'Archive' },
  { name: 'profile', href: '/profile', label: 'Profile' },
];
