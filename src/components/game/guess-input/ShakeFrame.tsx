import React, { type ReactNode, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { MOTION_DURATION_MS } from '@/styles/motion';

const SHAKE_STEPS = [-6, 6, -4, 4, 0];
const SHAKE_STEP_MS = MOTION_DURATION_MS.inputShake / SHAKE_STEPS.length;
const TINT_HALF_MS = MOTION_DURATION_MS.inputShake / 2;

// inputRejectTint is kept under reduced motion
const KEPT = { reduceMotion: ReduceMotion.Never };

type Props = {
  // A new key is a "Not in this XI": shake, and flash the border
  shakeKey: number;
  children: ReactNode;
};

// The input's channel for a wrong name; the text inside stays
const ShakeFrame = ({ shakeKey, children }: Props) => {
  const runs = useMotionPolicy();
  const shakes = runs('inputShake');
  const shakenKey = useRef(shakeKey);
  const shift = useSharedValue(0);
  const tint = useSharedValue(0);

  useEffect(() => {
    if (shakeKey === shakenKey.current) return;
    shakenKey.current = shakeKey;
    tint.set(
      withSequence(
        withTiming(1, { ...KEPT, duration: 0 }),
        withTiming(1, { ...KEPT, duration: TINT_HALF_MS }),
        withTiming(0, {
          ...KEPT,
          duration: TINT_HALF_MS,
          easing: Easing.in(Easing.ease),
        }),
      ),
    );
    if (!shakes) return;
    shift.set(
      withSequence(
        ...SHAKE_STEPS.map((x) => withTiming(x, { duration: SHAKE_STEP_MS })),
      ),
    );
  }, [shakeKey, shakes, shift, tint]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shift.get() }],
  }));
  const tintStyle = useAnimatedStyle(() => ({ opacity: tint.get() }));

  return (
    <Animated.View
      // A Reanimated style: the shake
      style={shakeStyle}
    >
      {children}
      <View pointerEvents="none" className="absolute inset-0">
        <Animated.View
          className="flex-1 rounded-md border-2 border-danger"
          // A Reanimated style: the red border's flash
          style={tintStyle}
        />
      </View>
    </Animated.View>
  );
};

export default ShakeFrame;
