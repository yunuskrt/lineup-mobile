import React from 'react';
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
};

// M10 swaps the filled slot for the reveal card
const GridSlot = ({
  position,
  size,
  player,
  missedPlayer,
  isLoading,
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
    <SquadSlot
      state="filled"
      position={position}
      size={size}
      name={player.name}
      imageUrl={player.imageUrl}
      foundBy={player.foundBy}
    />
  );
};

export default GridSlot;
