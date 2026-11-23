import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import ActorBar from '@/components/duel/lobby-panel/ActorBar';
import { CARD } from '@/components/duel/lobby-panel/styles';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import type { DuelActor } from '@/types/duel';

type Props = {
  actor: DuelActor;
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

const FilterCard = ({ actor, title, children, footer }: Props) => {
  return (
    <ShadowBox radiusClassName="rounded-lg" className={CARD}>
      <View className="gap-2">
        <ActorBar actor={actor} />
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="font-body-semibold text-14 text-fg"
        >
          {title}
        </Text>
      </View>
      {children}
      {footer}
    </ShadowBox>
  );
};

export default FilterCard;
