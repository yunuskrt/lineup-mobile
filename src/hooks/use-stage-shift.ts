import { useEffect } from 'react';
import {
  Easing,
  ReduceMotion,
  type SharedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MOTION_DURATION_MS, MOTION_EASING } from '@/styles/motion';

const [X1, Y1, X2, Y2] = MOTION_EASING.timerColorShift;

const SHIFT = {
  duration: MOTION_DURATION_MS.timerColorShift,
  easing: Easing.bezier(X1, Y1, X2, Y2),
  // timerColorShift is kept under reduced motion
  reduceMotion: ReduceMotion.Never,
};

// A clock stage change eases in; the sweep never does
export function useStageShift<T extends number | string>(
  value: T,
): SharedValue<T> {
  const shifted = useSharedValue(value);

  useEffect(() => {
    shifted.set(withTiming(value, SHIFT));
  }, [value, shifted]);

  return shifted;
}
