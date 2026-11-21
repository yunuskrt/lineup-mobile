import React, { type ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { type PressDepth, PLATE_OFFSET } from '@/components/ui/styles';
import { cn } from '@/lib/utils';
import { canDrawBoxShadow, SHADOW_HARD, SHADOW_HARD_SM } from '@/styles/shadow';

const DRAWS_BOX_SHADOW = canDrawBoxShadow(Platform.OS, Platform.Version);

type Props = {
  children: ReactNode;
  depth?: PressDepth;
  className?: string;
  radiusClassName?: string;
  // Dev previews only: what Android 7 and 8 draw
  isPlatePreview?: boolean;
};

// A hard shadow for surfaces that don't press
export const ShadowBox = ({
  children,
  depth = 'hard',
  className,
  radiusClassName = 'rounded-md',
  isPlatePreview = false,
}: Props) => {
  if (DRAWS_BOX_SHADOW && !isPlatePreview) {
    return (
      <View
        className={cn(radiusClassName, className)}
        // boxShadow: NativeWind can't express a hard shadow
        style={depth === 'hard' ? SHADOW_HARD : SHADOW_HARD_SM}
      >
        {children}
      </View>
    );
  }
  return (
    <View>
      <View
        className={cn(
          'absolute inset-0 bg-line',
          radiusClassName,
          PLATE_OFFSET[depth],
        )}
      />
      <View className={cn(radiusClassName, className)}>{children}</View>
    </View>
  );
};
