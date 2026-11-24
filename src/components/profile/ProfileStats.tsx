import React from 'react';
import { View } from 'react-native';
import {
  STAT_LABEL,
  STAT_ROW,
  STAT_TILE,
  STAT_VALUE,
  STATS_BLOCK,
} from '@/components/profile/styles';
import { Text } from '@/components/ui/text';
import { accuracyStat, soloRunCount } from '@/lib/profile';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS } from '@/styles/classes';
import type { UserStats } from '@/types/profile';

const MAX_FONT_SCALE = 1.2;

type Props = { stats: UserStats };

// Four stats in two ruled rows; labels wrap at 375
const ProfileStats = ({ stats }: Props) => {
  const rows = [
    [
      { label: 'Solo runs', value: String(soloRunCount(stats)) },
      { label: 'Perfect clears', value: String(stats.perfectClears) },
    ],
    [
      { label: 'Best streak', value: String(stats.bestStreak) },
      { label: 'Accuracy', value: accuracyStat(stats) },
    ],
  ];

  return (
    <View className={STATS_BLOCK}>
      {rows.map((tiles, rowIndex) => (
        <View
          key={tiles[0].label}
          className={cn(STAT_ROW, rowIndex === 0 && 'border-b-2 border-line')}
        >
          {tiles.map(({ label, value }, index) => (
            <View
              key={label}
              accessible
              accessibilityLabel={`${label} ${value}`}
              className={cn(STAT_TILE, index === 0 && 'border-r-2 border-line')}
            >
              <Text className={STAT_LABEL}>{label}</Text>
              <Text
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                className={STAT_VALUE}
                // fontVariant: NativeWind can't reach tabular figures
                style={TABULAR_NUMS}
              >
                {value}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ProfileStats;
