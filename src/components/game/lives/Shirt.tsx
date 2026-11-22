import React, { useEffect } from 'react';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { SHIRT_PATH } from '@/components/game/shirt';
import { MOTION_DURATION_MS } from '@/styles/motion';
import { ROLES } from '@/styles/tokens';
import type { DuelActor } from '@/types/duel';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// A lost life is the shirt's dashed outline
const LOST_DASH = [2.5, 2];

const SHAKE_STEPS = [-4, 4, -3, 3, 0];
const SHAKE_STEP_MS = MOTION_DURATION_MS.lifeLost / SHAKE_STEPS.length;

const FILL_FADE = {
  duration: MOTION_DURATION_MS.lifeLost,
  easing: Easing.ease,
  // lifeFill is kept under reduced motion
  reduceMotion: ReduceMotion.Never,
};

type Props = {
  owner: DuelActor;
  isFilled: boolean;
  isEmptying: boolean;
  shakes: boolean;
  isLarge: boolean;
};

const Shirt = ({ owner, isFilled, isEmptying, shakes, isLarge }: Props) => {
  const fillOpacity = useSharedValue(isFilled ? 1 : 0);
  const shift = useSharedValue(0);

  useEffect(() => {
    if (isFilled) fillOpacity.set(1);
    else if (isEmptying) fillOpacity.set(withTiming(0, FILL_FADE));
    else fillOpacity.set(0);
  }, [isFilled, isEmptying, fillOpacity]);

  useEffect(() => {
    if (!isEmptying || !shakes) return;
    shift.set(
      withSequence(
        ...SHAKE_STEPS.map((x) => withTiming(x, { duration: SHAKE_STEP_MS })),
      ),
    );
  }, [isEmptying, shakes, shift]);

  const fillProps = useAnimatedProps(() => ({
    fillOpacity: fillOpacity.get(),
  }));
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shift.get() }],
  }));

  return (
    <Animated.View
      className={isLarge ? 'h-7 w-7' : 'h-5 w-5'}
      // A Reanimated style: the life-lost shake
      style={shakeStyle}
    >
      <Svg viewBox="0 0 24 24" width="100%" height="100%">
        {/* Ink outline: the pastels alone are under 3:1 */}
        <AnimatedPath
          d={SHIRT_PATH}
          fill={ROLES[owner]}
          stroke={isFilled ? ROLES.line : ROLES['fg-dim']}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeDasharray={isFilled ? undefined : LOST_DASH}
          animatedProps={fillProps}
        />
      </Svg>
    </Animated.View>
  );
};

export default Shirt;
