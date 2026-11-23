import type { DuelActor } from '@/types/duel';

export const CARD = 'gap-3 border-2 border-line bg-surface-card p-4';

// The main action first, stacked
export const ACTIONS = 'w-full gap-3';

// A button's height, so locking in doesn't shift the card
export const STATUS_ROW = 'h-11 flex-row items-center gap-2';

export const ACTOR_BAR = 'h-2.5 w-10 rounded-full border-2 border-line';

export const ACTOR_BG: Record<DuelActor, string> = {
  you: 'bg-you',
  opponent: 'bg-opponent',
};

export const ACTOR_TEXT: Record<DuelActor, string> = {
  you: 'text-you-text',
  opponent: 'text-opponent-text',
};
