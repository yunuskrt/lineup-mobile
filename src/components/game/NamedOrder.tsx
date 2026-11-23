import React from 'react';
import { View } from 'react-native';
import Row from '@/components/game/named-order/Row';
import { Text } from '@/components/ui/text';
import { namedOrder, namedTotalsLabel } from '@/lib/summary';
import type { DuelNamedPlayer } from '@/types/duel';
import type { NamedPlayer } from '@/types/player';

export type NamedOrderProps =
  | { mode: 'solo'; found: NamedPlayer[]; missedCount: number }
  | { mode: 'duel'; found: DuelNamedPlayer[]; opponentHandle: string };

type Props = NamedOrderProps;

const EMPTY_COPY: Record<NamedOrderProps['mode'], string> = {
  solo: "You didn't name anyone this time.",
  duel: 'Nobody named a player.',
};

const NamedOrder = (props: Props) => {
  const { rows, fastestIndex } = namedOrder<NamedPlayer | DuelNamedPlayer>(
    props.found,
  );
  // Times across two players aren't a contest
  const markedIndex = props.mode === 'solo' ? fastestIndex : null;

  function finderOf(player: NamedPlayer | DuelNamedPlayer): string | null {
    if (props.mode === 'solo' || !('foundBy' in player)) return null;
    return player.foundBy === 'you' ? 'You' : props.opponentHandle;
  }

  return (
    <View className="gap-1">
      <Text
        accessibilityRole="header"
        className="font-body-medium text-14 text-fg"
      >
        Named in order
      </Text>
      {rows.length > 0 ? (
        <View>
          {rows.map((player, index) => (
            <Row
              key={player.id}
              player={player}
              finder={finderOf(player)}
              isFastest={index === markedIndex}
              isLast={index === rows.length - 1}
            />
          ))}
        </View>
      ) : (
        <Text className="text-14 text-fg-muted">{EMPTY_COPY[props.mode]}</Text>
      )}
      {props.mode === 'solo' ? (
        <View
          accessible
          className="h-10 flex-row items-center justify-between gap-2 border-t-2 border-line px-1"
        >
          <Text className="font-body-semibold text-14 text-fg">Total</Text>
          <Text className="font-body-semibold text-14 text-fg">
            {namedTotalsLabel(rows.length, props.missedCount)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default NamedOrder;
