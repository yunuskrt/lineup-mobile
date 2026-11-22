import React from 'react';
import { View } from 'react-native';
import CardFrame from '@/components/game/CardFrame';
import Dot from '@/components/game/duel-lives-card/Dot';
import PlayerLayer from '@/components/game/duel-lives-card/PlayerLayer';
import ReconnectChip from '@/components/game/ReconnectChip';
import { useShownActor } from '@/hooks/use-shown-actor';
import type { ConnectionState, DuelActor, DuelPlayer } from '@/types/duel';

const ACTORS: DuelActor[] = ['you', 'opponent'];

type Props = {
  you: DuelPlayer;
  // Null until pairing
  opponent: DuelPlayer | null;
  turn: DuelActor | null;
  opponentConnection?: ConnectionState | null;
  // The keyboard band's one row
  isCompact?: boolean;
};

const DuelLivesCard = ({
  you,
  opponent,
  turn,
  opponentConnection = null,
  isCompact = false,
}: Props) => {
  const players: Record<DuelActor, DuelPlayer | null> = { you, opponent };
  const { shown, setPeek } = useShownActor(turn, {
    you: you.lives,
    opponent: opponent?.lives ?? null,
  });
  const reconnectDeadline =
    opponentConnection?.status === 'reconnecting'
      ? opponentConnection.reconnectDeadline
      : null;

  return (
    <CardFrame
      isCompact={isCompact}
      chip={
        reconnectDeadline !== null ? (
          <ReconnectChip deadline={reconnectDeadline} />
        ) : null
      }
      footer={
        <View className="flex-row justify-center gap-1">
          {ACTORS.map((actor) => (
            <Dot
              key={actor}
              actor={actor}
              isShown={actor === shown}
              isDisabled={players[actor] === null}
              isReconnecting={
                actor === 'opponent' && reconnectDeadline !== null
              }
              onShow={setPeek}
            />
          ))}
        </View>
      }
    >
      {/* Both layers share one cell: same space either way */}
      <View>
        {ACTORS.map((actor) => {
          const player = players[actor];
          if (!player) return null;
          return (
            <PlayerLayer
              key={actor}
              actor={actor}
              player={player}
              isShown={actor === shown}
              isOverlay={actor === 'opponent'}
              isCompact={isCompact}
            />
          );
        })}
      </View>
    </CardFrame>
  );
};

export default DuelLivesCard;
