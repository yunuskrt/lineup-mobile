import React from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { pressHaptic } from '@/lib/haptics';
import { ROLES } from '@/styles/tokens';

type Props = {};

// A plain chevron in a 44pt target; the web ruled out the arrow tile
const BackButton = ({}: Props) => {
  return (
    <Pressable
      onPress={() => router.back()}
      onPressIn={pressHaptic}
      accessibilityRole="button"
      accessibilityLabel="Back"
      className="h-11 w-11 items-center justify-center"
    >
      <ChevronLeft size={26} strokeWidth={2.5} color={ROLES.fg} />
    </Pressable>
  );
};

export default BackButton;
