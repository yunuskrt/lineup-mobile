import React from 'react';
import RevealCard from '@/components/pitch/RevealCard';
import SquadSlot from '@/components/pitch/SquadSlot';
import type { SlotSize } from '@/types/pitch';
import type {
  FoundPlayer,
  PositionGroup,
  RevealedPlayer,
} from '@/types/player';

type Props = {
  position: PositionGroup;
  size: SlotSize;
  player: FoundPlayer | undefined;
  missedPlayer: RevealedPlayer | undefined;
  isLoading: boolean;
  isNew: boolean;
  pulseKey: number | undefined;
};

const GridSlot = ({
  position,
  size,
  player,
  missedPlayer,
  isLoading,
  isNew,
  pulseKey,
}: Props) => {
  if (isLoading) {
    return <SquadSlot state="loading" position={position} size={size} />;
  }
  if (!player && missedPlayer) {
    return (
      <SquadSlot
        state="missed"
        position={position}
        size={size}
        name={missedPlayer.name}
        imageUrl={missedPlayer.imageUrl}
      />
    );
  }
  if (!player) {
    return <SquadSlot state="empty" position={position} size={size} />;
  }
  return (
    <RevealCard
      player={player}
      position={position}
      size={size}
      isNew={isNew}
      pulseKey={pulseKey}
    />
  );
};

export default GridSlot;
