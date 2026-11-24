import React from 'react';
import { View } from 'react-native';
import ModeTag, { modeKind } from '@/components/profile/history-row/ModeTag';
import Outcome from '@/components/profile/history-row/Outcome';
import { HISTORY_LINE, HISTORY_ROW } from '@/components/profile/styles';
import { Text } from '@/components/ui/text';
import { SQUAD_SIZE } from '@/lib/api/schemas/common';
import { MAX_LIVES } from '@/lib/api/schemas/game';
import { historyOutcomeLabel, playedAtLabel } from '@/lib/profile';
import { matchSubtitle, scoreline } from '@/lib/summary';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS } from '@/styles/classes';
import type { HistoryEntry } from '@/types/profile';

const SPOKEN_MODES = {
  solo: 'Solo',
  duel: 'Duel',
  friend: 'Duel with a friend',
} as const;

type Props = {
  entry: HistoryEntry;
  today: Date | null;
  isLast: boolean;
};

// One game on two lines; lives are read, not drawn
const HistoryRow = ({ entry, today, isLast }: Props) => {
  const score = scoreline(entry.match, 'shortName');
  const subtitle = matchSubtitle(entry.match);
  const found = `${entry.foundCount} of ${SQUAD_SIZE}`;
  const playedAt = today ? playedAtLabel(entry.playedAt, today) : null;
  const label = [
    SPOKEN_MODES[modeKind(entry)],
    historyOutcomeLabel(entry),
    score,
    subtitle,
    `${found} named`,
    `${entry.livesRemaining} of ${MAX_LIVES} lives left`,
    playedAt,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View
      accessible
      accessibilityLabel={label}
      className={cn(HISTORY_ROW, !isLast && 'border-b-2 border-rule')}
    >
      <View className={HISTORY_LINE}>
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <ModeTag entry={entry} />
          <Outcome entry={entry} />
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 font-display text-14 text-fg"
            // fontVariant: NativeWind can't reach tabular figures
            style={TABULAR_NUMS}
          >
            {score}
          </Text>
        </View>
        <Text className="text-12 text-fg-muted">{playedAt}</Text>
      </View>
      <View className={HISTORY_LINE}>
        <Text
          numberOfLines={1}
          className="min-w-0 flex-1 text-14 text-fg-muted"
        >
          {subtitle}
        </Text>
        <Text
          className="font-body-medium text-14 text-fg"
          // fontVariant: NativeWind can't reach tabular figures
          style={TABULAR_NUMS}
        >
          {found}
        </Text>
      </View>
    </View>
  );
};

export default HistoryRow;
