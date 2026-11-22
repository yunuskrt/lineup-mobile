import React from 'react';
import { View } from 'react-native';
import { ACTOR_BAR } from '@/components/play/mode-choice/styles';
import { cn } from '@/lib/utils';
import type { DuelActor } from '@/types/duel';

const ACTOR_BG: Record<DuelActor, string> = {
  you: 'bg-you',
  opponent: 'bg-opponent',
};

type Props = { players: DuelActor[] };

const PlayerBars = ({ players }: Props) => {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="flex-row gap-1.5"
    >
      {players.map((player) => (
        <View key={player} className={cn(ACTOR_BAR, ACTOR_BG[player])} />
      ))}
    </View>
  );
};

export default PlayerBars;
