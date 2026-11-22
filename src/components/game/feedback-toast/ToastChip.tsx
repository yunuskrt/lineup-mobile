import React, { useEffect } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { MOTION_DURATION_MS } from '@/styles/motion';

const RISE_PT = 4;
const RISE_MS = 200;

// In over the first 10%, held to 80%, out by the end, as on web
const VISIBLE_MS = MOTION_DURATION_MS.toastVisible;
const FADE_IN_MS = VISIBLE_MS * 0.1;
const HOLD_MS = VISIBLE_MS * 0.7;
const FADE_OUT_MS = VISIBLE_MS * 0.2;

// toastFade is kept under reduced motion
const KEPT = {
  easing: Easing.out(Easing.ease),
  reduceMotion: ReduceMotion.Never,
};

type Props = { message: string };

// One verdict line; keyed per toast, so each one plays from the start
const ToastChip = ({ message }: Props) => {
  const runs = useMotionPolicy();
  const opacity = useSharedValue(0);
  const rise = useSharedValue(runs('toastRise') ? RISE_PT : 0);

  useEffect(() => {
    opacity.set(
      withSequence(
        withTiming(1, { ...KEPT, duration: FADE_IN_MS }),
        withTiming(1, { ...KEPT, duration: HOLD_MS }),
        withTiming(0, { ...KEPT, duration: FADE_OUT_MS }),
      ),
    );
    rise.set(withTiming(0, { duration: RISE_MS }));
  }, [opacity, rise]);

  const chipStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: rise.get() }],
  }));

  return (
    <Animated.View
      // A Reanimated style: the toast's fade and rise
      style={chipStyle}
    >
      <ShadowBox
        depth="hard-sm"
        className="border-2 border-line bg-surface-card px-3 py-0.5"
      >
        <Text className="font-body-medium text-14 text-fg">{message}</Text>
      </ShadowBox>
    </Animated.View>
  );
};

export default ToastChip;
