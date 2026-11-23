import React from 'react';
import Animated, {
  Easing,
  type EntryExitAnimationFunction,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import RevealCard from '@/components/pitch/RevealCard';
import SquadSlot from '@/components/pitch/SquadSlot';
import { MISSED_REVEAL_STAGGER_MS, MOTION_DURATION_MS } from '@/styles/motion';
import type { SlotSize } from '@/types/pitch';
import type {
  FoundPlayer,
  PositionGroup,
  RevealedPlayer,
} from '@/types/player';

// One by one, in squad order, as the player reveals
function missedEntrance(rank: number): EntryExitAnimationFunction {
  const delay = rank * MISSED_REVEAL_STAGGER_MS;
  const timing = {
    duration: MOTION_DURATION_MS.missedReveal,
    easing: Easing.out(Easing.ease),
  };
  return () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ scale: 0.96 }] },
      animations: {
        opacity: withDelay(delay, withTiming(1, timing)),
        transform: [{ scale: withDelay(delay, withTiming(1, timing)) }],
      },
    };
  };
}

type Props = {
  position: PositionGroup;
  size: SlotSize;
  player: FoundPlayer | undefined;
  missedPlayer: RevealedPlayer | undefined;
  // Null when the reveal doesn't animate
  missedRank: number | null;
  isLoading: boolean;
  isNew: boolean;
  pulseKey: number | undefined;
};

const GridSlot = ({
  position,
  size,
  player,
  missedPlayer,
  missedRank,
  isLoading,
  isNew,
  pulseKey,
}: Props) => {
  if (isLoading) {
    return <SquadSlot state="loading" position={position} size={size} />;
  }
  if (!player && missedPlayer) {
    return (
      <Animated.View
        entering={missedRank === null ? undefined : missedEntrance(missedRank)}
      >
        <SquadSlot
          state="missed"
          position={position}
          size={size}
          name={missedPlayer.name}
          imageUrl={missedPlayer.imageUrl}
        />
      </Animated.View>
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
