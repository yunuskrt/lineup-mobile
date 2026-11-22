import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { ROLES } from '@/styles/tokens';

const SPIN_MS = 800;

type Props = { isSpinning: boolean };

// The one spinner in the app; still when spinning is off, the cue stays
const Spinner = ({ isSpinning }: Props) => {
  const turn = useSharedValue(0);

  useEffect(() => {
    if (!isSpinning) return;
    turn.set(
      withRepeat(
        withTiming(360, {
          duration: SPIN_MS,
          easing: Easing.linear,
          // inputSpinner is kept under reduced motion
          reduceMotion: ReduceMotion.Never,
        }),
        -1,
      ),
    );
    return () => {
      cancelAnimation(turn);
      turn.set(0);
    };
  }, [isSpinning, turn]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${turn.get()}deg` }],
  }));

  return (
    // The field's own value already says "Checking"
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      className="absolute inset-y-0 right-3 justify-center"
    >
      <Animated.View
        className="h-4 w-4"
        // A Reanimated style: the spin
        style={spinStyle}
      >
        <Svg viewBox="0 0 16 16" width="100%" height="100%">
          <Circle
            cx={8}
            cy={8}
            r={6}
            fill="none"
            strokeWidth={2}
            stroke={ROLES.rule}
          />
          <Path
            d="M8 2a6 6 0 0 1 6 6"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            stroke={ROLES.line}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default Spinner;
