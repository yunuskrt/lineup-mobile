import React from 'react';
import { Text as NativeText, type TextProps } from 'react-native';
import { cn } from '@/lib/utils';

type Props = TextProps & { className?: string };

// React Native's Text is the system font; the kit's is Inter
export const Text = ({ className, ...props }: Props) => {
  return (
    <NativeText
      className={cn('font-body text-16 text-fg', className)}
      {...props}
    />
  );
};
