import React from 'react';
import CardFrame from '@/components/game/CardFrame';
import Tally from '@/components/game/Tally';
import type { Lives as LivesCount } from '@/types/game';

type Props = { lives: LivesCount };

const LivesCard = ({ lives }: Props) => {
  return (
    <CardFrame>
      <Tally lives={lives} />
    </CardFrame>
  );
};

export default LivesCard;
