import React, { useEffect, useState } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import FoundPulse from '@/components/pitch/reveal-card/FoundPulse';
import RevealFlash from '@/components/pitch/reveal-card/RevealFlash';
import SquadSlot from '@/components/pitch/SquadSlot';
import { useChangedSinceMount } from '@/hooks/use-changed-since-mount';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { SlotSize } from '@/types/pitch';
import type { FoundPlayer, PositionGroup } from '@/types/player';

const START_SCALE = 0.85;

// REVEAL_SPRING: a perceptual 320ms, bounce 0.25 as a damping ratio
const SPRING = { duration: MOTION_DURATION_MS.reveal, dampingRatio: 0.75 };

const FADE_IN = {
  duration: MOTION_DURATION_MS.reveal,
  easing: Easing.out(Easing.ease),
  // The fade carries the reveal, so it stays under reduced motion
  reduceMotion: ReduceMotion.Never,
};

type Props = {
  player: FoundPlayer;
  position: PositionGroup;
  size: SlotSize;
  isNew: boolean;
  pulseKey?: number;
};

// A found player's slot; only a new find animates in
const RevealCard = ({ player, position, size, isNew, pulseKey }: Props) => {
  const runs = useMotionPolicy();
  // Only the mounting render decides if it animates
  const [isRevealing] = useState(isNew);
  const [springs] = useState(() => runs('revealSpring'));
  const hasPulsed = useChangedSinceMount(pulseKey);
  const opacity = useSharedValue(isRevealing ? 0 : 1);
  const scale = useSharedValue(isRevealing && springs ? START_SCALE : 1);

  useEffect(() => {
    if (!isRevealing) return;
    opacity.set(withTiming(1, FADE_IN));
    if (springs) scale.set(withSpring(1, SPRING));
  }, [isRevealing, springs, opacity, scale]);

  const revealStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ scale: scale.get() }],
  }));

  const backdrop = (
    <>
      {isRevealing && runs('revealFlash') ? (
        <RevealFlash foundBy={player.foundBy ?? 'you'} />
      ) : null}
      {pulseKey !== undefined && hasPulsed && runs('alreadyFoundPulse') ? (
        <FoundPulse key={pulseKey} pulseKey={pulseKey} />
      ) : null}
    </>
  );

  return (
    <Animated.View
      // A Reanimated style: the reveal's fade and spring
      style={revealStyle}
    >
      <SquadSlot
        state="filled"
        position={position}
        size={size}
        name={player.name}
        imageUrl={player.imageUrl}
        foundBy={player.foundBy}
        backdrop={backdrop}
      />
    </Animated.View>
  );
};

export default RevealCard;
