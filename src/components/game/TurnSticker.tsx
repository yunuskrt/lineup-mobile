import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TURN_LABELS } from '@/lib/duel-status';
import type { DuelActor } from '@/types/duel';

type Props = { turn: DuelActor };

// Whose turn, in words as well as the finder's colour
const TurnSticker = ({ turn }: Props) => {
  return <Badge variant="sticker" tone={turn} label={TURN_LABELS[turn]} />;
};

export default TurnSticker;
