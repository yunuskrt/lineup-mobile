import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Tally from '@/components/game/Tally';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { DuelActor, DuelPlayer } from '@/types/duel';

const ACTOR_LABELS: Record<DuelActor, string> = {
  you: 'You',
  opponent: 'Opponent',
};

const SWITCH = {
  duration: MOTION_DURATION_MS.turnHandover,
  easing: Easing.out(Easing.ease),
  // livesSwitch is kept under reduced motion
  reduceMotion: ReduceMotion.Never,
};

type Props = {
  actor: DuelActor;
  player: DuelPlayer;
  isShown: boolean;
  // The layer that sets the card's height stays in the flow
  isOverlay: boolean;
  // The band drops the sticker row; the shirts' label names the player
  isCompact?: boolean;
};

// One player's lives; the hidden one is faded, untouchable and silent
const PlayerLayer = ({
  actor,
  player,
  isShown,
  isOverlay,
  isCompact = false,
}: Props) => {
  const opacity = useSharedValue(isShown ? 1 : 0);

  useEffect(() => {
    opacity.set(withTiming(isShown ? 1 : 0, SWITCH));
  }, [isShown, opacity]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View
      pointerEvents={isShown ? 'auto' : 'none'}
      accessibilityElementsHidden={!isShown}
      importantForAccessibility={isShown ? 'auto' : 'no-hide-descendants'}
      className={cn('gap-2', isOverlay && 'absolute inset-x-0 top-0')}
      // A Reanimated style: the cross-fade between players
      style={fadeStyle}
    >
      {isCompact ? null : (
        <View className="min-w-0 flex-row items-center gap-2">
          <Badge
            variant="sticker"
            tone={actor}
            tilt="none"
            label={ACTOR_LABELS[actor]}
          />
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 font-body-medium text-14"
          >
            {player.handle}
          </Text>
        </View>
      )}
      <Tally
        lives={player.lives}
        owner={actor}
        isCompact={isCompact}
        whose={isCompact ? ACTOR_LABELS[actor] : undefined}
      />
    </Animated.View>
  );
};

export default PlayerLayer;
