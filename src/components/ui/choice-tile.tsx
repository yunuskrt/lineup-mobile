import React, { type ReactNode } from 'react';
import type { AccessibilityRole } from 'react-native';
import { PressableFace } from '@/components/ui/pressable-face';
import { CHOICE_TILE } from '@/components/ui/styles';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  // The picked choice fills with the brand colour
  isSelected?: boolean;
  isDisabled?: boolean;
  // Flat while busy, as on web
  isBusy?: boolean;
  accessibilityLabel?: string;
  // A radio in a group, such as the mode cards; a button by default
  accessibilityRole?: AccessibilityRole;
  isPressedPreview?: boolean;
};

// A choice that presses like a button
export const ChoiceTile = ({
  children,
  onPress,
  isSelected = false,
  isDisabled = false,
  isBusy = false,
  accessibilityLabel,
  accessibilityRole = 'button',
  isPressedPreview,
}: Props) => {
  const isRadio = accessibilityRole === 'radio';
  return (
    <PressableFace
      onPress={onPress}
      isDisabled={isDisabled}
      isBusy={isBusy}
      isPressedPreview={isPressedPreview}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={
        isRadio ? { checked: isSelected } : { selected: isSelected }
      }
      className={cn(CHOICE_TILE, isSelected ? 'bg-brand' : 'bg-surface-card')}
    >
      {children}
    </PressableFace>
  );
};
