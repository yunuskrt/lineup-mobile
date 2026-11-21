import React from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { PressableFace } from '@/components/ui/pressable-face';
import {
  BUTTON_DISABLED,
  BUTTON_FACE,
  BUTTON_LABEL,
  BUTTON_LABEL_DISABLED,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

type Props = {
  label?: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  isDisabled?: boolean;
  isBusy?: boolean;
  // Required for an icon-only button
  accessibilityLabel?: string;
  isPressedPreview?: boolean;
};

export const Button = ({
  label,
  icon: Icon,
  variant = 'primary',
  size = 'default',
  onPress,
  isDisabled = false,
  isBusy = false,
  accessibilityLabel,
  isPressedPreview,
}: Props) => {
  const isInert = isDisabled || isBusy;
  return (
    <PressableFace
      onPress={onPress}
      isDisabled={isDisabled}
      isBusy={isBusy}
      isPressedPreview={isPressedPreview}
      accessibilityLabel={accessibilityLabel ?? label}
      className={cn(
        BUTTON_FACE,
        BUTTON_VARIANT[variant],
        BUTTON_SIZE[size],
        isInert && BUTTON_DISABLED[variant],
      )}
    >
      {Icon ? (
        <Icon size={20} strokeWidth={2.5} color={ROLES['on-accent']} />
      ) : null}
      {label ? (
        <Text
          className={cn(
            BUTTON_LABEL[size],
            isInert && BUTTON_LABEL_DISABLED[variant],
          )}
        >
          {label}
        </Text>
      ) : null}
    </PressableFace>
  );
};
