import React from 'react';
import { View } from 'react-native';
import MoreActions from '@/components/archive/archive-row/MoreActions';
import {
  ARCHIVE_ACTIONS,
  ARCHIVE_META,
  ARCHIVE_ROW,
  ARCHIVE_TEAMS,
  TEAM_NAME,
} from '@/components/archive/styles';
import ClubCrest from '@/components/game/ClubCrest';
import CompetitionLogo from '@/components/game/CompetitionLogo';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { archiveDateLabel, playMatchLabel } from '@/lib/archive';
import { matchEvent } from '@/lib/summary';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';
import type { MatchIdentity } from '@/types/match';

const ROW_ACTIONS = [
  { kind: 'play', verb: 'Play' },
  { kind: 'practice', verb: 'Practise' },
] as const;

type Props = {
  match: MatchIdentity;
  // `practice` starts it with no clock (R14)
  onPlay: (match: MatchIdentity, practice: boolean) => void;
  // A guest is being made for this row's run
  starting: 'play' | 'practice' | null;
  // Another row is starting
  isDisabled: boolean;
  // Small phones: no crests, Practise behind a "more" sheet
  isCompact: boolean;
  isLast: boolean;
};

const ArchiveRow = ({
  match,
  onPlay,
  starting,
  isDisabled,
  isCompact,
  isLast,
}: Props) => {
  const date = archiveDateLabel(match.date);
  const event = matchEvent(match);
  const { home, away, score } = match;
  const isWaiting = isDisabled || starting !== null;
  const label = [
    `${home.name} ${score.home} to ${score.away} ${away.name}`,
    event,
    date,
    match.nickname,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View className={cn(ARCHIVE_ROW, !isLast && 'border-b-2 border-rule')}>
      <View accessible accessibilityLabel={label} className="gap-2">
        <View className={ARCHIVE_TEAMS}>
          {/* Right-aligned by its box: Android clips right-set ellipses */}
          <View className="min-w-0 flex-1 items-end">
            <Text numberOfLines={1} className={TEAM_NAME}>
              {home.name}
            </Text>
          </View>
          {isCompact ? null : (
            <ClubCrest club={home} size="row" fallbackFill="raised" />
          )}
          <Text
            className={cn(TYPE_NUMBER, 'w-12 text-center text-16')}
            // fontVariant: NativeWind can't reach tabular figures
            style={TABULAR_NUMS}
          >
            {score.home}
            <Text className="text-fg-dim">–</Text>
            {score.away}
          </Text>
          {isCompact ? null : (
            <ClubCrest club={away} size="row" fallbackFill="raised" />
          )}
          <View className="min-w-0 flex-1 items-start">
            <Text numberOfLines={1} className={TEAM_NAME}>
              {away.name}
            </Text>
          </View>
        </View>
        <View className={ARCHIVE_META}>
          <CompetitionLogo competition={match.competition} size={16} />
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 text-12 text-fg-muted"
          >
            {[event, date, match.nickname].filter(Boolean).join(' · ')}
          </Text>
        </View>
      </View>
      <View className={ARCHIVE_ACTIONS}>
        {(isCompact ? ROW_ACTIONS.slice(0, 1) : ROW_ACTIONS).map(
          ({ kind, verb }) => {
            // Compact: Practise starts from the sheet, Play says so
            const isStarting = isCompact
              ? starting !== null
              : starting === kind;
            return (
              <Button
                key={kind}
                label={isStarting ? 'Starting…' : verb}
                variant="secondary"
                isBusy={isStarting}
                isDisabled={isWaiting && !isStarting}
                accessibilityLabel={playMatchLabel(match, verb)}
                onPress={() => onPlay(match, kind === 'practice')}
              />
            );
          },
        )}
        {isCompact ? (
          <MoreActions
            match={match}
            isDisabled={isWaiting}
            onPlay={(practice) => onPlay(match, practice)}
          />
        ) : null}
      </View>
    </View>
  );
};

export default ArchiveRow;
