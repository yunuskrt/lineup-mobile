import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import RingArcs from '@/components/game/countdown-ring/RingArcs';
import { STAGE_WEIGHTS } from '@/components/game/countdown-ring/shared';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { useRoundClock } from '@/hooks/use-round-clock';
import { useStageShift } from '@/hooks/use-stage-shift';
import { ringStage } from '@/lib/countdown';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';
import { ROLES, type Role } from '@/styles/tokens';
import type { CountdownStage, RingMode } from '@/types/countdown';
import type { DuelActor } from '@/types/duel';
import type { RoundTiming } from '@/types/game';

// A fixed-size game piece: larger text would break the ring
const MAX_FONT_SCALE = 1;

export type RingSize = 'full' | 'band';

// 144pt on the full board; 56pt in the band, so two digits fit
const RING_BOX: Record<RingSize, string> = {
  full: 'h-36 w-36',
  band: 'h-14 w-14',
};

// 64 meets the arc at 144pt, so the web's phone size
const RING_NUMBER: Record<RingSize, string> = {
  full: 'text-48',
  band: 'text-16',
};

type RingTone = { stroke: Role; text: Role };

const OWNER_TONES: Record<DuelActor, RingTone> = {
  you: { stroke: 'you', text: 'fg' },
  opponent: { stroke: 'opponent', text: 'opponent-text' },
};

const STAGE_TONES: Record<Exclude<CountdownStage, 'calm'>, RingTone> = {
  warning: { stroke: 'warning', text: 'warning-text' },
  critical: { stroke: 'danger', text: 'danger-text' },
};

const WAITING_TONE: RingTone = { stroke: 'fg-dim', text: 'fg-dim' };

function toneFor(
  mode: RingMode,
  owner: DuelActor,
  stage: CountdownStage,
): RingTone {
  if (mode === 'waiting') return WAITING_TONE;
  return stage === 'calm' ? OWNER_TONES[owner] : STAGE_TONES[stage];
}

type Props = {
  round: RoundTiming;
  mode: RingMode;
  owner?: DuelActor;
  // The band's small ring sits beside the lives
  size?: RingSize;
};

const CountdownRing = ({
  round,
  mode,
  owner = 'you',
  size = 'full',
}: Props) => {
  const runs = useMotionPolicy();
  const { fraction, seconds } = useRoundClock(round, mode);
  const stage = ringStage(mode, owner, seconds);
  const tone = toneFor(mode, owner, stage);
  const isPulsing =
    mode === 'running' && stage === 'critical' && runs('ringCriticalPulse');
  const textColour = useStageShift(ROLES[tone.text]);
  const numberStyle = useAnimatedStyle(() => ({ color: textColour.get() }));

  return (
    <View
      accessible
      accessibilityRole="timer"
      accessibilityLabel="Time left"
      accessibilityValue={{ text: `${seconds} seconds` }}
      className={cn('items-center justify-center', RING_BOX[size])}
    >
      <RingArcs
        fraction={fraction}
        weight={STAGE_WEIGHTS[stage]}
        stroke={ROLES[tone.stroke]}
        isPulsing={isPulsing}
      />
      <Animated.Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        className={cn(TYPE_NUMBER, RING_NUMBER[size])}
        // fontVariant is beyond NativeWind; the colour is Reanimated's
        style={[TABULAR_NUMS, numberStyle]}
      >
        {seconds}
      </Animated.Text>
      {size === 'full' ? (
        <Text
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          className="text-12 text-fg-muted"
        >
          seconds
        </Text>
      ) : null}
    </View>
  );
};

export default CountdownRing;
