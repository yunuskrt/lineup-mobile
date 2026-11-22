import type { LucideIcon } from 'lucide-react-native';
import type { DuelActor } from '@/types/duel';
import type { ModeOption } from '@/types/play';

export type ModeCard = {
  option: ModeOption;
  title: string;
  text: string;
  icon: LucideIcon;
  players: DuelActor[];
};

export const PRACTICE_CAPTION =
  'Practice is part of Pro: no clock, no lives, not saved.';
