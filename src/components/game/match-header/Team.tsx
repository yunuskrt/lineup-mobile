import React from 'react';
import { View } from 'react-native';
import ClubCrest from '@/components/game/ClubCrest';
import { Text } from '@/components/ui/text';
import type { HeaderSide } from '@/lib/match-header';
import { cn } from '@/lib/utils';

type Props = {
  team: HeaderSide;
};

// Crest over the short name; the named XI's crest gets the accent ring
const Team = ({ team }: Props) => {
  return (
    <View className="min-w-0 flex-1 items-center gap-1">
      <View
        className={cn(
          'rounded-md border-2 p-0.5',
          team.isNamed ? 'border-score-digits' : 'border-transparent',
        )}
      >
        <View className="rounded-sm bg-surface-card">
          <ClubCrest club={team.club} />
        </View>
      </View>
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        className={cn(
          'text-center text-14 text-on-scoreboard',
          team.isNamed ? 'font-body-semibold' : 'font-body-medium opacity-70',
        )}
      >
        {team.club.shortName}
      </Text>
    </View>
  );
};

export default Team;
