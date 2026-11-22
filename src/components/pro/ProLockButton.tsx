import React from 'react';
import { View } from 'react-native';
import {
  BUTTON_FACE,
  BUTTON_LABEL,
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { ProLockSize } from '@/types/pro-lock';

type Props = {
  label: string;
  size?: ProLockSize;
  // Read after the label, as the web's aria-describedby
  caption?: string;
};

// Flat and muted, never presses: it does nothing
const ProLockButton = ({ label, size = 'default', caption }: Props) => {
  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={caption}
      accessibilityState={{ disabled: true }}
      className={cn(
        BUTTON_FACE,
        BUTTON_VARIANT.secondary,
        BUTTON_SIZE[size],
        'self-start rounded-md',
      )}
    >
      <Text className={cn(BUTTON_LABEL[size], 'text-fg-muted')}>{label}</Text>
    </View>
  );
};

export default ProLockButton;
