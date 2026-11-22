import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MOTION_DURATION_MS } from '@/styles/motion';

const HALF_PULSE = {
  duration: MOTION_DURATION_MS.alreadyFoundPulse / 2,
  easing: Easing.inOut(Easing.ease),
  // alreadyFoundPulse is kept under reduced motion
  reduceMotion: ReduceMotion.Never,
};

type Props = {
  // A new key is an "Already named": the slot pulses once
  pulseKey: number;
};

// The grid's channel for a name already found
const FoundPulse = ({ pulseKey }: Props) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.set(
      withSequence(withTiming(1, HALF_PULSE), withTiming(0, HALF_PULSE)),
    );
  }, [pulseKey, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute inset-0 rounded-md border-2 border-already-found-pulse"
      // A Reanimated style: the pulse in and out
      style={pulseStyle}
    >
      <View className="flex-1 rounded-md bg-already-found-pulse opacity-50" />
    </Animated.View>
  );
};

export default FoundPulse;
