import React from 'react';
import { Pressable } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useSound } from '@/hooks/use-sound';
import { pressHaptic } from '@/lib/haptics';
import { ROLES } from '@/styles/tokens';

type Props = {
  // Cream on the ink scoreboard, ink everywhere else
  isOnScoreboard?: boolean;
};

// One mute for every cue, remembered on the device
const SoundToggle = ({ isOnScoreboard = false }: Props) => {
  const { isMuted, toggleMuted } = useSound();
  const Icon = isMuted ? VolumeX : Volume2;

  return (
    <Pressable
      onPress={toggleMuted}
      onPressIn={pressHaptic}
      accessibilityRole="switch"
      accessibilityLabel="Mute sounds"
      accessibilityState={{ checked: isMuted }}
      className="h-11 w-11 items-center justify-center"
    >
      <Icon
        size={22}
        strokeWidth={2.5}
        color={isOnScoreboard ? ROLES['on-scoreboard'] : ROLES.fg}
      />
    </Pressable>
  );
};

export default SoundToggle;
