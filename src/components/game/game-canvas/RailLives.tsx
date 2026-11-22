import React from 'react';
import DuelLivesCard from '@/components/game/DuelLivesCard';
import LivesCard from '@/components/game/LivesCard';
import type { CanvasView } from '@/types/canvas';

type Props = { view: CanvasView; isCompact?: boolean };

const RailLives = ({ view, isCompact = false }: Props) => {
  if (view.mode === 'solo') {
    return <LivesCard lives={view.lives} isCompact={isCompact} />;
  }

  return (
    <DuelLivesCard
      you={view.you}
      opponent={view.opponent}
      turn={view.turn}
      opponentConnection={view.opponentConnection}
      isCompact={isCompact}
    />
  );
};

export default RailLives;
