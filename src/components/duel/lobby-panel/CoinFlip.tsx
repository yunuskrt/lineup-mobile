import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import {
  ACTOR_BAR,
  ACTOR_BG,
  ACTOR_TEXT,
  CARD,
} from '@/components/duel/lobby-panel/styles';
import SummaryList from '@/components/duel/lobby-panel/SummaryList';
import { Badge } from '@/components/ui/badge';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { cn } from '@/lib/utils';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { DuelActor } from '@/types/duel';
import type { DuelLobbyView } from '@/types/duel-lobby';

const ACTORS: DuelActor[] = ['you', 'opponent'];

type Props = {
  lobby: Extract<DuelLobbyView, { step: 'coinFlip' }>;
};

// Names whose filters won; the loser's mark stays, dimmed
const CoinFlip = ({ lobby }: Props) => {
  const runs = useMotionPolicy();
  const { winner } = lobby;
  const title =
    winner === 'you' ? 'Your filters' : `${lobby.opponent.handle}'s filters`;
  const entering = runs('coinFlipScale')
    ? ZoomIn.duration(MOTION_DURATION_MS.reveal).withInitialValues({
        transform: [{ scale: 0.96 }],
      })
    : FadeIn.duration(MOTION_DURATION_MS.reveal);

  return (
    <Animated.View entering={entering} className="pt-3">
      <ShadowBox radiusClassName="rounded-lg" className={CARD}>
        <View className="flex-row items-center gap-1.5">
          {ACTORS.map((actor) => (
            <View
              key={actor}
              className={cn(
                ACTOR_BAR,
                ACTOR_BG[actor],
                actor === winner ? 'w-16' : 'opacity-40',
              )}
            />
          ))}
        </View>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className={cn('font-body-semibold text-14', ACTOR_TEXT[winner])}
        >
          {title}
        </Text>
        <SummaryList summary={lobby.applied} />
      </ShadowBox>
      <View className="absolute right-4 top-0">
        <Badge label="Used" variant="sticker" tone={winner} tilt="right" />
      </View>
    </Animated.View>
  );
};

export default CoinFlip;
