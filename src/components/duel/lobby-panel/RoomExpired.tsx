import React from 'react';
import { View } from 'react-native';
import { ACTIONS } from '@/components/duel/lobby-panel/styles';
import { Button } from '@/components/ui/button';
import type { LobbyAction } from '@/types/duel-lobby';

type Props = { onAction: (action: LobbyAction) => void };

// Never a dead end: a new room, or back to play
const RoomExpired = ({ onAction }: Props) => {
  return (
    <View className={ACTIONS}>
      <Button label="Create a new room" onPress={() => onAction('newRoom')} />
      <Button
        label="Back to play"
        variant="secondary"
        onPress={() => onAction('cancel')}
      />
    </View>
  );
};

export default RoomExpired;
