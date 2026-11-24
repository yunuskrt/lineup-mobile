import React from 'react';
import { Pressable } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { FILTER_CHIP } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

// The pill is ~32pt tall; slop takes the target to 44pt
const HIT_SLOP = 6;

type Props = {
  // The filter's name, shown while it's on Any
  name: string;
  value: string;
  isActive: boolean;
  onPress: () => void;
};

// A filter chip that opens its sheet; lavender once picked
const SheetChip = ({ name, value, isActive, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressHaptic}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`${name}: ${value}`}
      className={cn(
        FILTER_CHIP,
        'max-w-full flex-row items-center gap-1',
        isActive ? 'bg-brand' : 'bg-surface-card active:bg-surface-raised',
      )}
    >
      <Text numberOfLines={1} className="flex-shrink font-body-medium text-14">
        {isActive ? value : name}
      </Text>
      <ChevronDown size={16} strokeWidth={2.5} color={ROLES.fg} />
    </Pressable>
  );
};

export default SheetChip;
