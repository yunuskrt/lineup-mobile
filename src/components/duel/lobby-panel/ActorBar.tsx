import React from 'react';
import { View } from 'react-native';
import { ACTOR_BAR, ACTOR_BG } from '@/components/duel/lobby-panel/styles';
import { cn } from '@/lib/utils';
import type { DuelActor } from '@/types/duel';

type Props = { actor: DuelActor };

const ActorBar = ({ actor }: Props) => {
  return <View className={cn(ACTOR_BAR, ACTOR_BG[actor])} />;
};

export default ActorBar;
