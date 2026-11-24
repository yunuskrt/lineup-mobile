import React from 'react';
import { View } from 'react-native';
import LetterTile, {
  type Tile,
} from '@/components/profile/duel-record/LetterTile';
import {
  RECORD_BAR,
  RECORD_BLOCK,
  RECORD_HEADER,
  RECORD_NUMERAL,
} from '@/components/profile/styles';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { duelCountLabel, duelRecord, recordShares } from '@/lib/profile';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS } from '@/styles/classes';
import type { UserStats } from '@/types/profile';

// Fixed-size figures: larger text would break the row of three
const MAX_FONT_SCALE = 1.2;

type Props = { stats: UserStats };

const DuelRecord = ({ stats }: Props) => {
  const record = duelRecord(stats);
  const shares = recordShares(stats);
  const hasDuels = record.total > 0;
  const counts: { label: string; value: number; tile: Tile }[] = [
    { label: 'Won', value: record.wins, tile: 'win' },
    { label: 'Drawn', value: record.draws, tile: 'draw' },
    { label: 'Lost', value: record.losses, tile: 'loss' },
  ];
  const segments = [
    { key: 'wins', share: shares.wins, fill: 'bg-you' },
    { key: 'draws-you', share: shares.draws / 2, fill: 'bg-you' },
    { key: 'draws-opponent', share: shares.draws / 2, fill: 'bg-opponent' },
    { key: 'losses', share: shares.losses, fill: 'bg-danger' },
  ].filter(({ share }) => share > 0);

  return (
    <ShadowBox radiusClassName="rounded-lg" className={RECORD_BLOCK}>
      <View className={RECORD_HEADER}>
        <Text accessibilityRole="header" className="font-body-semibold text-14">
          Duel record
        </Text>
        <Text
          className="text-14"
          // fontVariant: NativeWind can't reach tabular figures
          style={TABULAR_NUMS}
        >
          {duelCountLabel(record.total)}
        </Text>
      </View>
      <View className="flex-row gap-4">
        {counts.map(({ label, value, tile }) => (
          <View
            key={label}
            accessible
            accessibilityLabel={`${label} ${value}`}
            className="min-w-0 flex-1 gap-2"
          >
            <View className="flex-row items-center gap-1.5">
              <LetterTile tile={tile} isMuted={!hasDuels} />
              <Text
                numberOfLines={1}
                className="font-body-medium text-12 uppercase"
              >
                {label}
              </Text>
            </View>
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              className={RECORD_NUMERAL}
              // fontVariant: NativeWind can't reach tabular figures
              style={TABULAR_NUMS}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>
      {/* Ink gaps split the segments; none yet is white */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className={cn(RECORD_BAR, hasDuels ? 'bg-line' : 'bg-surface-card')}
      >
        {segments.map(({ key, share, fill }) => (
          <View
            key={key}
            className={fill}
            // A share known only at run time
            style={{ flex: share }}
          />
        ))}
      </View>
    </ShadowBox>
  );
};

export default DuelRecord;
