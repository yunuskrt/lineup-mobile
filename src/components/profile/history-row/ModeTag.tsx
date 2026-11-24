import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { HistoryEntry } from '@/types/profile';

export type ModeKind = 'solo' | 'duel' | 'friend';

const MODE_LABELS: Record<ModeKind, string> = {
  solo: 'Solo',
  duel: 'Duel',
  friend: 'Friend',
};

// Neither side's colour: a mode is not a side
const MODE_TONES = {
  solo: 'mint',
  duel: 'purple',
  friend: 'butter',
} as const;

// A private room's duel is a friend's
export function modeKind(entry: HistoryEntry): ModeKind {
  if (entry.mode === 'solo') return 'solo';
  return entry.isPrivate ? 'friend' : 'duel';
}

type Props = { entry: HistoryEntry };

// Read through the row's label, so drawn only
const ModeTag = ({ entry }: Props) => {
  const kind = modeKind(entry);
  return (
    <Badge
      label={MODE_LABELS[kind]}
      variant="sticker"
      tone={MODE_TONES[kind]}
      tilt="none"
    />
  );
};

export default ModeTag;
