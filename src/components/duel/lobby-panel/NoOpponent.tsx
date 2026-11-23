import React from 'react';
import { View } from 'react-native';
import { ACTIONS } from '@/components/duel/lobby-panel/styles';
import { Button } from '@/components/ui/button';
import type { LobbyAction } from '@/types/duel-lobby';

type Props = { onAction: (action: LobbyAction) => void };

const NoOpponent = ({ onAction }: Props) => {
  return (
    <View className={ACTIONS}>
      <Button
        label="Play solo with these filters"
        onPress={() => onAction('solo')}
      />
      <Button
        label="Search again"
        variant="secondary"
        onPress={() => onAction('searchAgain')}
      />
    </View>
  );
};

export default NoOpponent;
