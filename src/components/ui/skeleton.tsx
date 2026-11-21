import React, { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { cn } from '@/lib/utils';
import { MOTION_DURATION_MS, SKELETON_PULSE_OPACITY } from '@/styles/motion';

const [, PULSE_LOW] = SKELETON_PULSE_OPACITY;
const HALF_PULSE_MS = MOTION_DURATION_MS.skeletonPulse / 2;

type Props = {
  // The size of what loads into it, e.g. h-5 w-32
  className?: string;
};

// A placeholder the exact size of its content
export const Skeleton = ({ className }: Props) => {
  const pulses = useMotionPolicy()('skeletonPulse');
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!pulses) return;
    opacity.value = withRepeat(
      withSequence(
        withTiming(PULSE_LOW, { duration: HALF_PULSE_MS }),
        withTiming(1, { duration: HALF_PULSE_MS }),
      ),
      -1,
    );
    // Stopped mid-pulse, it settles back to full, not half faded
    return () => {
      cancelAnimation(opacity);
      opacity.value = 1;
    };
  }, [pulses, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn('rounded-sm bg-skeleton-fill', className)}
      // A Reanimated style: the opacity pulse
      style={pulseStyle}
    />
  );
};
