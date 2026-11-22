import React from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { pressHaptic } from '@/lib/haptics';
import { ROLES } from '@/styles/tokens';

type Props = {
  // Without a handler the chip just leaves
  onQuit?: () => void;
  // Cream on the ink scoreboard, ink everywhere else
  isOnScoreboard?: boolean;
};

const QuitChip = ({ onQuit, isOnScoreboard = false }: Props) => {
  const leave = () => router.dismissTo('/play');
  return (
    <Pressable
      onPress={onQuit ?? leave}
      onPressIn={pressHaptic}
      accessibilityRole="button"
      accessibilityLabel="Quit"
      className="h-11 w-11 items-center justify-center"
    >
      <X
        size={24}
        strokeWidth={2.5}
        color={isOnScoreboard ? ROLES['on-scoreboard'] : ROLES.fg}
      />
    </Pressable>
  );
};

export default QuitChip;
