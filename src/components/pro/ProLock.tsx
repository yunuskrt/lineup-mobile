import React from 'react';
import { View } from 'react-native';
import ProLockButton from '@/components/pro/ProLockButton';
import ProLockCaption from '@/components/pro/ProLockCaption';
import { cn } from '@/lib/utils';
import type { ProLockSize } from '@/types/pro-lock';

type Props = {
  label: string;
  caption: string;
  size?: ProLockSize;
  // While the tier is unknown: no caption yet
  isPending?: boolean;
  isFullWidth?: boolean;
};

// The locked control with its caption and See Pro
const ProLock = ({
  label,
  caption,
  size = 'default',
  isPending = false,
  isFullWidth = false,
}: Props) => {
  return (
    <View className={cn('gap-3', isFullWidth ? 'self-stretch' : 'self-start')}>
      <ProLockButton
        label={label}
        size={size}
        caption={isPending ? undefined : caption}
        isFullWidth={isFullWidth}
      />
      {isPending ? null : <ProLockCaption caption={caption} />}
    </View>
  );
};

export default ProLock;
