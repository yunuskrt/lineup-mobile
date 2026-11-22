import React from 'react';
import { Pressable, View } from 'react-native';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import type { DuelActor } from '@/types/duel';

// A 24pt box; slop takes the target to 44pt
const HIT_SLOP = 10;

const DOT_LABELS: Record<DuelActor, string> = {
  you: 'Show your lives',
  opponent: "Show opponent's lives",
};

const ACTOR_BG: Record<DuelActor, string> = {
  you: 'bg-you',
  opponent: 'bg-opponent',
};

type Props = {
  actor: DuelActor;
  isShown: boolean;
  isDisabled: boolean;
  isReconnecting: boolean;
  onShow: (actor: DuelActor) => void;
};

// A tap here never takes the keyboard or the guess's focus
const Dot = ({ actor, isShown, isDisabled, isReconnecting, onShow }: Props) => {
  const tone = isDisabled
    ? 'border-fg-dim'
    : cn(
        'border-line',
        isShown && (isReconnecting ? 'bg-warning' : ACTOR_BG[actor]),
      );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={DOT_LABELS[actor]}
      accessibilityState={{ selected: isShown, disabled: isDisabled }}
      disabled={isDisabled}
      hitSlop={HIT_SLOP}
      onPressIn={pressHaptic}
      onPress={() => onShow(actor)}
      className="h-6 w-6 items-center justify-center"
    >
      <View className={cn('h-3 w-3 rounded-full border-2', tone)} />
    </Pressable>
  );
};

export default Dot;
