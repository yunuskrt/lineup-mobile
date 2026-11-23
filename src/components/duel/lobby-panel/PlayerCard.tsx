import React from 'react';
import { View } from 'react-native';
import { User } from 'lucide-react-native';
import { ACTOR_BG } from '@/components/duel/lobby-panel/styles';
import { IconTile } from '@/components/ui/icon-tile';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { DuelActor, DuelPlayer } from '@/types/duel';

type Props = {
  actor: DuelActor;
  player: DuelPlayer;
};

const PlayerCard = ({ actor, player }: Props) => {
  const role = actor === 'you' ? 'You' : 'Opponent';

  return (
    <ShadowBox
      radiusClassName="rounded-lg"
      className={cn(
        'items-center gap-2 border-2 border-line p-4',
        ACTOR_BG[actor],
      )}
    >
      <View
        accessible
        accessibilityLabel={`${role}: ${player.handle}`}
        className="w-full items-center gap-2"
      >
        <IconTile icon={User} />
        <Text
          numberOfLines={1}
          className="font-body-semibold text-16 text-on-accent"
        >
          {player.handle}
        </Text>
        <Text className="text-12 text-on-accent">{role}</Text>
      </View>
    </ShadowBox>
  );
};

export default PlayerCard;
