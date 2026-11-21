import React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

// A 20pt box; slop takes the target to 44pt
const HIT_SLOP = 12;

type Props = {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  label?: string;
  isDisabled?: boolean;
};

export const Checkbox = ({
  isChecked,
  onChange,
  label,
  isDisabled = false,
}: Props) => {
  return (
    <Pressable
      onPress={() => onChange(!isChecked)}
      onPressIn={pressHaptic}
      disabled={isDisabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
      className="flex-row items-center gap-3 self-start"
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-sm border-2 border-line',
          isChecked ? 'bg-brand' : 'bg-surface-card',
          isDisabled && 'opacity-70',
        )}
      >
        {isChecked ? (
          <Check size={14} strokeWidth={3} color={ROLES['on-accent']} />
        ) : null}
      </View>
      {label ? <Text className="text-14">{label}</Text> : null}
    </Pressable>
  );
};
