import React, { useEffect } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { DuelActor } from '@/types/duel';

const PEAK_OPACITY = 0.4;
const FADE_MS = 640;

const FLASH_TONES: Record<DuelActor, string> = {
  you: 'bg-reveal-flash-you',
  opponent: 'bg-reveal-flash-opponent',
};

type Props = { foundBy: DuelActor };

// The finder's colour behind a new find, fading after the reveal
const RevealFlash = ({ foundBy }: Props) => {
  const opacity = useSharedValue(PEAK_OPACITY);

  useEffect(() => {
    opacity.set(
      withDelay(
        MOTION_DURATION_MS.reveal,
        withTiming(0, {
          duration: FADE_MS,
          easing: Easing.out(Easing.ease),
          // revealFlash is kept under reduced motion
          reduceMotion: ReduceMotion.Never,
        }),
        ReduceMotion.Never,
      ),
    );
  }, [opacity]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      pointerEvents="none"
      className={`absolute inset-0 rounded-md ${FLASH_TONES[foundBy]}`}
      // A Reanimated style: the flash fades
      style={fadeStyle}
    />
  );
};

export default RevealFlash;
