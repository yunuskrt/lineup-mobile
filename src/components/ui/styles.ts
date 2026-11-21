import type { SHADOW_OFFSET } from '@/styles/tokens';

export type PressDepth = keyof typeof SHADOW_OFFSET;

// The plate sits 4pt or 2pt down and right, as SHADOW_HARD does
export const PLATE_OFFSET: Record<PressDepth, string> = {
  hard: 'translate-x-1 translate-y-1',
  'hard-sm': 'translate-x-0.5 translate-y-0.5',
};

export type ButtonVariant = 'primary' | 'secondary';

export type ButtonSize = 'default' | 'large' | 'icon';

export const BUTTON_FACE =
  'flex-row items-center justify-center gap-2 border-2 border-line';

export const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-brand',
  secondary: 'bg-surface-card',
};

// 44pt and 56pt tall: phone targets, not the web's heights
export const BUTTON_SIZE: Record<ButtonSize, string> = {
  default: 'h-11 px-4',
  large: 'h-14 px-8',
  icon: 'h-11 w-11',
};

export const BUTTON_LABEL: Record<ButtonSize, string> = {
  default: 'font-body-semibold text-14',
  large: 'font-body-semibold text-16',
  icon: 'font-body-semibold text-14',
};

export const BUTTON_DISABLED: Record<ButtonVariant, string> = {
  primary: 'opacity-70',
  secondary: '',
};

export const BUTTON_LABEL_DISABLED: Record<ButtonVariant, string> = {
  primary: '',
  secondary: 'text-fg-muted',
};

export const CHOICE_TILE = 'border-2 border-line p-4';

export const ICON_TILE =
  'items-center justify-center rounded-md border-2 border-line';

export type BadgeVariant = 'tag' | 'sticker';

export type BadgeTone =
  | 'neutral'
  | 'green'
  | 'amber'
  | 'red'
  | 'blue'
  | 'purple'
  | 'yellow'
  | 'grey'
  | 'brand'
  | 'you'
  | 'opponent'
  | 'found'
  | 'warning'
  | 'mint'
  | 'butter'
  | 'coral';

export type BadgeTilt = 'none' | 'left' | 'right';

export const BADGE_VARIANT: Record<BadgeVariant, string> = {
  tag: 'rounded-full px-2.5 py-0.5',
  sticker: 'rounded-sm px-2 py-0.5',
};

export const BADGE_LABEL: Record<BadgeVariant, string> = {
  tag: 'font-body-medium text-12',
  sticker: 'font-display text-12 uppercase',
};

export const BADGE_TONE: Record<BadgeTone, string> = {
  neutral: 'bg-surface-card',
  green: 'bg-tag-green',
  amber: 'bg-tag-amber',
  red: 'bg-tag-red',
  blue: 'bg-tag-blue',
  purple: 'bg-tag-purple',
  yellow: 'bg-tag-yellow',
  grey: 'bg-tag-grey',
  brand: 'bg-brand',
  you: 'bg-you',
  opponent: 'bg-opponent',
  found: 'bg-found',
  warning: 'bg-warning',
  mint: 'bg-block-mint',
  butter: 'bg-block-butter',
  coral: 'bg-block-coral',
};

export const BADGE_TILT: Record<BadgeTilt, string> = {
  none: '',
  left: '-rotate-3',
  right: 'rotate-2',
};

export const FILTER_CHIP =
  'self-start rounded-full border-2 border-line px-3 py-1.25';

export const TEXT_INPUT =
  'h-12 rounded-md border-2 border-line bg-surface-card px-3 font-body text-16 text-fg';
