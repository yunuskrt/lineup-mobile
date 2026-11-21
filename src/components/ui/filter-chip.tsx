import React from 'react';
import { Pressable } from 'react-native';
import { FILTER_CHIP } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';

// The pill is ~32pt tall; slop takes the target to 44pt
const HIT_SLOP = 6;

type Props = {
  label: string;
  isOn: boolean;
  onPress: () => void;
  isDisabled?: boolean;
};

// A pill toggle, lavender when on; flat, as on web
export const FilterChip = ({
  label,
  isOn,
  onPress,
  isDisabled = false,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressHaptic}
      disabled={isDisabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ selected: isOn, disabled: isDisabled }}
      className={cn(
        FILTER_CHIP,
        isOn ? 'bg-brand' : 'bg-surface-card active:bg-surface-raised',
        isDisabled && 'opacity-70',
      )}
    >
      <Text className="font-body-medium text-14">{label}</Text>
    </Pressable>
  );
};
