import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Users } from 'lucide-react-native';
import ActorBar from '@/components/duel/lobby-panel/ActorBar';
import { ACTOR_BAR } from '@/components/duel/lobby-panel/styles';
import { Button } from '@/components/ui/button';
import { IconTile } from '@/components/ui/icon-tile';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { cn } from '@/lib/utils';
import { MOTION_DURATION_MS, SKELETON_PULSE_OPACITY } from '@/styles/motion';
import type { LobbyAction } from '@/types/duel-lobby';

const [, PULSE_LOW] = SKELETON_PULSE_OPACITY;
const HALF_PULSE_MS = MOTION_DURATION_MS.skeletonPulse / 2;

type Props = { onAction: (action: LobbyAction) => void };

// Ambient, no clock: nothing is lost while you wait
const Searching = ({ onAction }: Props) => {
  const isPulsing = useMotionPolicy()('lobbyPulse');
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!isPulsing) return;
    opacity.value = withRepeat(
      withSequence(
        withTiming(PULSE_LOW, { duration: HALF_PULSE_MS }),
        withTiming(1, { duration: HALF_PULSE_MS }),
      ),
      -1,
    );
    return () => {
      cancelAnimation(opacity);
      opacity.value = 1;
    };
  }, [isPulsing, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View className="items-center gap-5">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="items-center gap-5"
      >
        <IconTile icon={Users} size="lg" />
        {/* The opponent's mark waits, dim, to be filled */}
        <View className="flex-row gap-1.5">
          <ActorBar actor="you" />
          <Animated.View
            className={cn(ACTOR_BAR, 'bg-fg-dim')}
            // A Reanimated style: the ambient breath
            style={pulseStyle}
          />
        </View>
      </View>
      <View className="self-stretch">
        <Button
          label="Cancel"
          variant="secondary"
          onPress={() => onAction('cancel')}
        />
      </View>
    </View>
  );
};

export default Searching;
