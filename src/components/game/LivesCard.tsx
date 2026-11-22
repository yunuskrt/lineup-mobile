import React from 'react';
import CardFrame from '@/components/game/CardFrame';
import Tally from '@/components/game/Tally';
import type { Lives as LivesCount } from '@/types/game';

type Props = { lives: LivesCount; isCompact?: boolean };

const LivesCard = ({ lives, isCompact = false }: Props) => {
  return (
    <CardFrame isCompact={isCompact}>
      <Tally lives={lives} isCompact={isCompact} />
    </CardFrame>
  );
};

export default LivesCard;
