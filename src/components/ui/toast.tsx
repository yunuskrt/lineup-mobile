import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { ToastMessage } from '@/types/feedback';

// The web's FeedbackToast: in by 10%, held to 80%, out by 100%
const VISIBLE_MS = MOTION_DURATION_MS.toastVisible;
const FADE_IN_MS = VISIBLE_MS * 0.1;
const HOLD_MS = VISIBLE_MS * 0.7;
const FADE_OUT_MS = VISIBLE_MS * 0.2;
const RISE_PT = 4;
const RISE_MS = 200;

type Props = {
  // A new id replays it; it never holds the only copy
  toast: ToastMessage | null;
};

export const Toast = ({ toast }: Props) => {
  const runs = useMotionPolicy();
  const rises = runs('toastRise');
  const opacity = useSharedValue(0);
  const rise = useSharedValue(0);
  // Faded text must not linger for screen readers
  const [endedId, setEndedId] = useState<number | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = toast.id;
    opacity.value = 0;
    opacity.value = withSequence(
      withTiming(1, { duration: FADE_IN_MS }),
      withDelay(
        HOLD_MS,
        withTiming(0, { duration: FADE_OUT_MS }, (isFinished) => {
          if (isFinished) runOnJS(setEndedId)(id);
        }),
      ),
    );
    rise.value = rises ? RISE_PT : 0;
    rise.value = withTiming(0, { duration: RISE_MS });
  }, [toast, rises, opacity, rise]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: rise.value }],
  }));

  const isShown = toast !== null && toast.id !== endedId;
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      className="h-8 items-center justify-center"
    >
      {isShown ? (
        <Animated.View
          key={toast.id}
          // A Reanimated style: the fade and the rise
          style={toastStyle}
        >
          <ShadowBox
            depth="hard-sm"
            className="border-2 border-line bg-surface-card px-3 py-0.5"
          >
            <Text className="font-body-medium text-14">{toast.message}</Text>
          </ShadowBox>
        </Animated.View>
      ) : null}
    </View>
  );
};
