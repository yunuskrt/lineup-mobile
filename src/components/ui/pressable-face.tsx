import React, { type ReactNode } from 'react';
import {
  type AccessibilityRole,
  type AccessibilityState,
  Pressable,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { type PressDepth, PLATE_OFFSET } from '@/components/ui/styles';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { SHADOW_OFFSET } from '@/styles/tokens';

const PRESS_IN_MS = 80;
const PRESS_OUT_MS = 140;

type Props = {
  children: ReactNode;
  onPress?: () => void;
  // Flat and inert; a disabled control doesn't buzz
  isDisabled?: boolean;
  // Flat and inert while working; the label stays
  isBusy?: boolean;
  depth?: PressDepth;
  className?: string;
  radiusClassName?: string;
  // Dev previews only: shows the face sunk onto its plate
  isPressedPreview?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
  hitSlop?: number;
};

// The face sinks into its ink plate on press, as on web
export const PressableFace = ({
  children,
  onPress,
  isDisabled = false,
  isBusy = false,
  depth = 'hard',
  className,
  radiusClassName = 'rounded-md',
  isPressedPreview = false,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityState,
  hitSlop,
}: Props) => {
  const shifts = useMotionPolicy()('pressShift');
  const isInert = isDisabled || isBusy;
  const offset = SHADOW_OFFSET[depth];
  const pressed = useSharedValue(isPressedPreview ? 1 : 0);

  const faceStyle = useAnimatedStyle(() => {
    const shift = shifts ? pressed.value * offset : 0;
    return { transform: [{ translateX: shift }, { translateY: shift }] };
  });
  // Reduced motion: no shift, the shadow just drops
  const plateStyle = useAnimatedStyle(() => ({
    opacity: shifts ? 1 : 1 - pressed.value,
  }));

  const pressIn = () => {
    pressed.value = shifts ? withTiming(1, { duration: PRESS_IN_MS }) : 1;
    pressHaptic();
  };
  const pressOut = () => {
    pressed.value = shifts ? withTiming(0, { duration: PRESS_OUT_MS }) : 0;
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={isInert}
      hitSlop={hitSlop}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        ...accessibilityState,
        disabled: isInert,
        busy: isBusy,
      }}
    >
      <View>
        {isInert ? null : (
          <Animated.View
            className={cn(
              'absolute inset-0 bg-line',
              radiusClassName,
              PLATE_OFFSET[depth],
            )}
            // A Reanimated style: the plate hides under reduced motion
            style={plateStyle}
          />
        )}
        <Animated.View
          className={cn(radiusClassName, className)}
          // A Reanimated style: the face slides onto the plate
          style={faceStyle}
        >
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
};
