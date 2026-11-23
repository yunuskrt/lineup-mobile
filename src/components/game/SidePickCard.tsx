import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import CompetitionLogo from '@/components/game/CompetitionLogo';
import { enterFrom } from '@/components/game/side-pick-card/shared';
import Tile from '@/components/game/side-pick-card/Tile';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { matchDateLabel } from '@/lib/summary';
import { TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';
import type { CanvasSidePick } from '@/types/canvas';
import type { Side } from '@/types/match';

const SCORE = `${TYPE_NUMBER} text-30 leading-9`;

type Props = {
  sidePick: CanvasSidePick;
  onPick: (side: Side) => void;
};

// The match, its score, and a tile per side; the score has its own row
const SidePickCard = ({ sidePick, onPick }: Props) => {
  const runs = useMotionPolicy();
  const { match } = sidePick;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-shrink flex-row items-center gap-1.5">
          <CompetitionLogo competition={match.competition} size={20} />
          <Text numberOfLines={1} className="flex-shrink text-14 text-fg-muted">
            {match.competition.name}
          </Text>
        </View>
        <Text className="text-14 text-fg-muted">
          {matchDateLabel(match.date)}
        </Text>
      </View>
      <Animated.View
        entering={runs('sidePickSlide') ? enterFrom(0) : undefined}
        accessible
        accessibilityLabel={`${match.score.home} to ${match.score.away}`}
        className="flex-row items-baseline justify-center gap-1.5"
      >
        <Text
          maxFontSizeMultiplier={1.3}
          className={SCORE}
          // NativeWind can't reach tnum; see TABULAR_NUMS
          style={TABULAR_NUMS}
        >
          {match.score.home}
        </Text>
        <Text maxFontSizeMultiplier={1.3} className={`${SCORE} text-fg-dim`}>
          –
        </Text>
        <Text
          maxFontSizeMultiplier={1.3}
          className={SCORE}
          // NativeWind can't reach tnum; see TABULAR_NUMS
          style={TABULAR_NUMS}
        >
          {match.score.away}
        </Text>
      </Animated.View>
      <View className="flex-row gap-2">
        <Tile sidePick={sidePick} side="home" onPick={onPick} />
        <Tile sidePick={sidePick} side="away" onPick={onPick} />
      </View>
    </View>
  );
};

export default SidePickCard;
