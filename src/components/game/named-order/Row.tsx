import React from 'react';
import { View } from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import PlayerHeadshot from '@/components/pitch/PlayerHeadshot';
import { Text } from '@/components/ui/text';
import { findTimeLabel } from '@/lib/summary';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS } from '@/styles/classes';
import { ROLES } from '@/styles/tokens';
import type { DuelActor, DuelNamedPlayer } from '@/types/duel';
import type { NamedPlayer } from '@/types/player';

const ACTOR_BAR: Record<DuelActor, string> = {
  you: 'bg-you',
  opponent: 'bg-opponent',
};

const ACTOR_TEXT: Record<DuelActor, string> = {
  you: 'text-you-text',
  opponent: 'text-opponent-text',
};

const HEADSHOT_SIZE = 24;

type Props = {
  player: NamedPlayer | DuelNamedPlayer;
  finder: string | null;
  isFastest: boolean;
  isLast: boolean;
};

// A table row on the rail, as game/15-results-a
const Row = ({ player, finder, isFastest, isLast }: Props) => {
  const actor = 'foundBy' in player ? player.foundBy : null;
  const time = findTimeLabel(player.elapsedMs);
  const label = [
    `${player.order}. ${player.name}`,
    finder ? `named by ${finder}` : null,
    time,
    isFastest ? 'fastest' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View
      accessible
      accessibilityLabel={label}
      className={cn(
        'h-10 flex-row items-center gap-2 pr-1',
        actor ? 'pl-3' : 'pl-1',
        !isLast && 'border-b-2 border-rule',
      )}
    >
      {/* The finder's colour, beside the label */}
      {actor ? (
        <View
          className={cn(
            'absolute bottom-1 left-0 top-1 w-1 rounded-full',
            ACTOR_BAR[actor],
          )}
        />
      ) : null}
      <Text
        className="w-5 text-12 text-fg-muted"
        // fontVariant: NativeWind can't reach tabular figures
        style={TABULAR_NUMS}
      >
        {player.order}
      </Text>
      <PlayerHeadshot
        name={player.name}
        imageUrl={player.imageUrl}
        diameter={HEADSHOT_SIZE}
      />
      <Text
        numberOfLines={1}
        className="min-w-0 flex-1 font-body-medium text-14 text-fg"
      >
        {player.name}
      </Text>
      {actor && finder ? (
        <Text
          numberOfLines={1}
          className={cn(
            'max-w-24 font-body-semibold text-12',
            ACTOR_TEXT[actor],
          )}
        >
          {finder}
        </Text>
      ) : null}
      <Text
        className={cn(
          'text-14',
          isFastest ? 'font-body-semibold text-fg' : 'text-fg-muted',
        )}
        // fontVariant: NativeWind can't reach tabular figures
        style={TABULAR_NUMS}
      >
        {time}
      </Text>
      <CircleCheck size={16} strokeWidth={2.5} color={ROLES['found-text']} />
    </View>
  );
};

export default Row;
