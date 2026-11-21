import {
  Easing,
  type EntryExitAnimationFunction,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { type EntranceOptions, entranceTiming } from '@/lib/entrance';

export type Entrance = {
  // Undefined when reduced: shown at once, never left hidden
  item: (
    index: number,
    options?: EntranceOptions,
  ) => EntryExitAnimationFunction | undefined;
};

// One entrance per group, on mount; instant when reduced
export function useEntrance(): Entrance {
  const animates = useMotionPolicy()('landingEntrance');
  return {
    item: (index, options) => {
      if (!animates) return undefined;
      const { delayMs, durationMs, rise, fromScale } = entranceTiming(
        index,
        options,
      );
      const timing = { duration: durationMs, easing: Easing.out(Easing.ease) };
      return () => {
        'worklet';
        return {
          initialValues: {
            opacity: 0,
            transform: [{ translateY: rise }, { scale: fromScale ?? 1 }],
          },
          animations: {
            opacity: withDelay(delayMs, withTiming(1, timing)),
            transform: [
              { translateY: withDelay(delayMs, withTiming(0, timing)) },
              { scale: withDelay(delayMs, withTiming(1, timing)) },
            ],
          },
        };
      };
    },
  };
}
