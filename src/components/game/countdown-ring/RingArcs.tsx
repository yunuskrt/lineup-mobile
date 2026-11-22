import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { STAGE_WEIGHTS } from '@/components/game/countdown-ring/shared';
import { useStageShift } from '@/hooks/use-stage-shift';
import {
  ARC_DASH,
  arcDashOffset,
  RING_RADIUS,
  TRACK_DASH,
} from '@/lib/countdown-arc';
import { ROLES } from '@/styles/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// An open arc, as game/05-timer-a: the gap at the bottom
const ARC_START_DEGREES = 135;

// The ink edge shows this much either side
const EDGE_WIDTH = 3;

// 1 → 0.6 → 1 each second
const PULSE_LOW = 0.6;
const HALF_PULSE = { duration: 500, easing: Easing.inOut(Easing.ease) };

const ARC = {
  cx: 50,
  cy: 50,
  r: RING_RADIUS,
  fill: 'none',
  strokeLinecap: 'round',
} as const;

type Props = {
  fraction: SharedValue<number>;
  weight: number;
  stroke: string;
  isPulsing: boolean;
};

// The track, then the stage arc over its ink edge
const RingArcs = ({ fraction, weight, stroke, isPulsing }: Props) => {
  const width = useStageShift(weight);
  const colour = useStageShift(stroke);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!isPulsing) return;
    pulse.set(
      withRepeat(
        withSequence(
          withTiming(PULSE_LOW, HALF_PULSE),
          withTiming(1, HALF_PULSE),
        ),
        -1,
      ),
    );
    return () => {
      cancelAnimation(pulse);
      pulse.set(1);
    };
  }, [isPulsing, pulse]);

  // A spent arc would leave a round-cap dot
  const edgeProps = useAnimatedProps(() => ({
    strokeDashoffset: arcDashOffset(fraction.get()),
    strokeWidth: width.get() + EDGE_WIDTH,
    opacity: fraction.get() > 0 ? 1 : 0,
  }));
  const stageProps = useAnimatedProps(() => ({
    strokeDashoffset: arcDashOffset(fraction.get()),
    strokeWidth: width.get(),
    stroke: colour.get(),
    opacity: fraction.get() > 0 ? 1 : 0,
  }));
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.get() }));

  return (
    <View className="absolute inset-0">
      <Svg viewBox="0 0 100 100" width="100%" height="100%">
        <G rotation={ARC_START_DEGREES} originX={50} originY={50}>
          <Circle
            {...ARC}
            stroke={ROLES.rule}
            strokeWidth={STAGE_WEIGHTS.calm}
            strokeDasharray={TRACK_DASH}
          />
        </G>
      </Svg>
      <Animated.View
        className="absolute inset-0"
        // A Reanimated style: the critical pulse
        style={pulseStyle}
      >
        <Svg viewBox="0 0 100 100" width="100%" height="100%">
          <G rotation={ARC_START_DEGREES} originX={50} originY={50}>
            <AnimatedCircle
              {...ARC}
              stroke={ROLES.line}
              strokeDasharray={ARC_DASH}
              animatedProps={edgeProps}
            />
            <AnimatedCircle
              {...ARC}
              strokeDasharray={ARC_DASH}
              animatedProps={stageProps}
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

export default RingArcs;
