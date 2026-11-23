import type { DuelActor } from '@/types/duel';

export const ACTOR_BAR = 'h-2.5 w-10 rounded-full border-2 border-line';

export const ACTOR_BG: Record<DuelActor, string> = {
  you: 'bg-you',
  opponent: 'bg-opponent',
};
