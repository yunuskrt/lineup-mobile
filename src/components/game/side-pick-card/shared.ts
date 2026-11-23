import {
  Easing,
  type EntryExitAnimationFunction,
  withTiming,
} from 'react-native-reanimated';
import { MOTION_DURATION_MS } from '@/styles/motion';

const ENTRANCE = {
  duration: MOTION_DURATION_MS.sidePickEntrance,
  easing: Easing.out(Easing.ease),
};

// Fades in from a sideways offset: a tile from its side, the score from 0
export function enterFrom(offsetX: number): EntryExitAnimationFunction {
  return () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ translateX: offsetX }] },
      animations: {
        opacity: withTiming(1, ENTRANCE),
        transform: [{ translateX: withTiming(0, ENTRANCE) }],
      },
    };
  };
}
