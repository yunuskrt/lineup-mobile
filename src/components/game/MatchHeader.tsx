import React from 'react';
import { View } from 'react-native';
import CompetitionLogo from '@/components/game/CompetitionLogo';
import Placeholder from '@/components/game/match-header/Placeholder';
import Team from '@/components/game/match-header/Team';
import { Text } from '@/components/ui/text';
import { matchHeaderView } from '@/lib/match-header';
import { compactScoreParts, scoreboardLabel } from '@/lib/scoreboard';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';
import type { MatchInPlay } from '@/types/match';

const LOGO_PT = 16;

type Props = {
  match: MatchInPlay | null;
  // The one-line strip, for the keyboard band and small phones
  isCompact?: boolean;
  // A 48pt room at each end: Quit on the left, sound on the right
  hasControls?: boolean;
};

// The ink scoreboard every game screen leads with
const MatchHeader = ({
  match,
  isCompact = false,
  hasControls = false,
}: Props) => {
  // Quit sits left and sound right (user), so the score stays centred
  const box = cn(
    'bg-scoreboard',
    isCompact
      ? 'h-11 flex-row items-center justify-center'
      : 'h-28 justify-center',
    hasControls ? 'px-12' : 'px-3',
  );

  if (!match) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className={box}
      >
        <Placeholder isCompact={isCompact} />
      </View>
    );
  }

  if (isCompact) {
    const { score, context } = compactScoreParts(match);
    return (
      <View
        accessible
        accessibilityLabel={scoreboardLabel(match)}
        className={box}
      >
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
          className="flex-shrink text-center text-14 text-on-scoreboard"
        >
          <Text className="font-body-semibold text-14 text-score-digits">
            {score}
          </Text>
          <Text className="text-14 text-on-scoreboard opacity-75">
            {`  ·  ${context}`}
          </Text>
        </Text>
      </View>
    );
  }

  const view = matchHeaderView(match);
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={scoreboardLabel(match)}
      className={cn(box, 'gap-1.5')}
    >
      <View className="flex-row items-center gap-2">
        <Team team={view.home} />
        <Text
          maxFontSizeMultiplier={1.2}
          className={cn(TYPE_NUMBER, 'text-32 text-score-digits')}
          // fontVariant: NativeWind can't reach tabular figures
          style={TABULAR_NUMS}
        >
          {view.home.score}
          <Text className="text-on-scoreboard opacity-50">{' – '}</Text>
          {view.away.score}
        </Text>
        <Team team={view.away} />
      </View>
      <View className="h-5 flex-row items-center justify-center gap-3">
        <View className="min-w-0 flex-shrink flex-row items-center gap-1.5">
          <View className="rounded-sm bg-surface-card p-px">
            <CompetitionLogo competition={match.competition} size={LOGO_PT} />
          </View>
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
            className="flex-shrink text-12 text-on-scoreboard opacity-75"
          >
            {view.competition}
          </Text>
        </View>
        <Text
          maxFontSizeMultiplier={1.2}
          className="text-12 text-on-scoreboard opacity-75"
        >
          {view.date}
        </Text>
      </View>
    </View>
  );
};

export default MatchHeader;
