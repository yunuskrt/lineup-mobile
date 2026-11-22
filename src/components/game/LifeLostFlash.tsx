import React, { useEffect } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useChangedSinceMount } from '@/hooks/use-changed-since-mount';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { MOTION_DURATION_MS } from '@/styles/motion';

const PEAK_OPACITY = 0.25;

// Up in the first quarter, then a slower fade, as on web
const RISE_MS = MOTION_DURATION_MS.lifeLost / 4;
const FADE_MS = MOTION_DURATION_MS.lifeLost - RISE_MS;

// lifeLostFlash is kept under reduced motion
const KEPT = {
  easing: Easing.out(Easing.ease),
  reduceMotion: ReduceMotion.Never,
};

type Props = {
  // A new key flashes; the first one never does
  flashKey: number;
};

// Over the whole screen it's placed on; it never takes a touch
const LifeLostFlash = ({ flashKey }: Props) => {
  const runs = useMotionPolicy();
  const hasFlashed = useChangedSinceMount(flashKey);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!hasFlashed) return;
    opacity.set(
      withSequence(
        withTiming(PEAK_OPACITY, { ...KEPT, duration: RISE_MS }),
        withTiming(0, { ...KEPT, duration: FADE_MS }),
      ),
    );
  }, [flashKey, hasFlashed, opacity]);

  const flashStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  if (!hasFlashed || !runs('lifeLostFlash')) return null;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute inset-0 z-50 bg-danger"
      // A Reanimated style: the flash's rise and fade
      style={flashStyle}
    />
  );
};

export default LifeLostFlash;
