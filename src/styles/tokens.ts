// No runtime import: the Tailwind config loads this file outside Metro
import type { RoleToken } from '@/styles/contrast';

// The web's tokens.css primitives, under the same names
export const PALETTE = {
  cream: '#fefae0',
  'peach-cream': '#faedcd',
  'sage-pale': '#e9edc9',
  sage: '#ccd5ae',
  caramel: '#d4a373',
  white: '#ffffff',

  lavender: '#c4b5fd',
  mint: '#a7e3c4',
  butter: '#ffd972',
  coral: '#ff9f8a',

  'duel-blue': '#7fb2f5',
  'duel-orange': '#ff9e6d',

  'status-green': '#4caf6e',
  'status-amber': '#ffb938',
  'status-red': '#f0564a',

  ink: '#1f1b16',
  umber: '#5e554c',
  taupe: '#8a7f73',

  'blue-deep': '#0c64d7',
  'orange-deep': '#bc3f00',
  'green-deep': '#317649',
  'amber-deep': '#915e00',
  'red-deep': '#cf1a0c',

  'tint-green': '#e1fae7',
  'tint-amber': '#fff4ee',
  'tint-red': '#fdefee',
  'tint-blue': '#e5f3fe',
  'tint-purple': '#efeaff',
  'tint-yellow': '#fcf5db',
  'tint-grey': '#f1f1f1',
} as const;

// The web's color-mix() roles, resolved in OKLCH (design-mobile.md)
export const MIXED = {
  rule: '#d2ccb7',
  'turf-check': '#9bc7a5',
  'reveal-flash-opponent': '#aaac3b',
  'gate-scrim': '#1f1b1666',
} as const;

// The web's --spacing: every spacing step is 4pt
export const SPACING_UNIT = 4;

export const RADIUS = { sm: 6, md: 10, lg: 16, full: 9999 } as const;

export const SHADOW_OFFSET = { hard: 4, 'hard-sm': 2 } as const;

// Size and line height in points; 1.0 for display and big numbers
export const TEXT_SIZES = {
  12: 16,
  14: 20,
  16: 24,
  20: 25,
  24: 30,
  28: 35,
  30: 38,
  32: 40,
  34: 34,
  40: 50,
  48: 60,
  64: 64,
  72: 72,
} as const;

// One family per embedded face, named after its PostScript name
export const FONT_FAMILIES = {
  body: 'Inter-Regular',
  'body-medium': 'Inter-Medium',
  'body-semibold': 'Inter-SemiBold',
  display: 'ArchivoSemiExpanded-ExtraBold',
  'display-black': 'ArchivoExpanded-Black',
  'display-bold': 'Archivo-Bold',
} as const;

// Roles theme.css has that the contrast suite doesn't pair
type DecorativeRole =
  | 'rule'
  | 'accent-caramel'
  | 'reveal-flash-you'
  | 'reveal-flash-opponent'
  | 'already-found-pulse'
  | 'turf-check'
  | 'skeleton-fill'
  | 'gate-scrim';

export type Role = RoleToken | DecorativeRole;

// The web's theme.css roles, under the same names
export const ROLES: Record<Role, string> = {
  surface: PALETTE.cream,
  'surface-raised': PALETTE['peach-cream'],
  'surface-card': PALETTE.white,
  'surface-sage': PALETTE['sage-pale'],

  line: PALETTE.ink,
  rule: MIXED.rule,
  marking: PALETTE.sage,

  fg: PALETTE.ink,
  'fg-muted': PALETTE.umber,
  'fg-dim': PALETTE.taupe,
  'on-accent': PALETTE.ink,
  focus: PALETTE.ink,

  brand: PALETTE.lavender,
  you: PALETTE['duel-blue'],
  opponent: PALETTE['duel-orange'],
  found: PALETTE['status-green'],
  warning: PALETTE['status-amber'],
  danger: PALETTE['status-red'],

  'you-text': PALETTE['blue-deep'],
  'opponent-text': PALETTE['orange-deep'],
  'found-text': PALETTE['green-deep'],
  'warning-text': PALETTE['amber-deep'],
  'danger-text': PALETTE['red-deep'],

  'block-lavender': PALETTE.lavender,
  'block-mint': PALETTE.mint,
  'block-butter': PALETTE.butter,
  'block-coral': PALETTE.coral,
  'accent-caramel': PALETTE.caramel,

  'tag-green': PALETTE['tint-green'],
  'tag-amber': PALETTE['tint-amber'],
  'tag-red': PALETTE['tint-red'],
  'tag-blue': PALETTE['tint-blue'],
  'tag-purple': PALETTE['tint-purple'],
  'tag-yellow': PALETTE['tint-yellow'],
  'tag-grey': PALETTE['tint-grey'],

  'reveal-flash-you': PALETTE['status-green'],
  'reveal-flash-opponent': MIXED['reveal-flash-opponent'],

  'already-found-pulse': PALETTE.umber,

  turf: PALETTE.mint,
  'turf-check': MIXED['turf-check'],

  scoreboard: PALETTE.ink,
  'on-scoreboard': PALETTE.cream,
  'score-digits': PALETTE.butter,

  'skeleton-fill': PALETTE['sage-pale'],
  'gate-scrim': MIXED['gate-scrim'],
};
