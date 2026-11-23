import React, { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

type Props = {
  label: string;
  // A radio closes its sheet; a checkbox leaves it open
  kind: 'radio' | 'checkbox';
  isChecked: boolean;
  onPress: () => void;
  image?: ReactNode;
};

// One ruled row of a filter sheet; the whole row is the target
const OptionRow = ({ label, kind, isChecked, onPress, image }: Props) => {
  const isRadio = kind === 'radio';
  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressHaptic}
      accessibilityRole={kind}
      accessibilityLabel={label}
      accessibilityState={{ checked: isChecked }}
      className="min-h-11 flex-row items-center gap-3 border-b-2 border-rule py-3 active:bg-surface-raised"
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center border-2 border-line',
          isRadio ? 'rounded-full' : 'rounded-sm',
          isChecked ? 'bg-brand' : 'bg-surface-card',
        )}
      >
        {isChecked && isRadio ? (
          <View className="h-2 w-2 rounded-full bg-fg" />
        ) : null}
        {isChecked && !isRadio ? (
          <Check size={14} strokeWidth={3} color={ROLES['on-accent']} />
        ) : null}
      </View>
      {image}
      <Text
        className={cn(
          'flex-1 text-14',
          isChecked ? 'font-body-semibold' : 'font-body',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default OptionRow;
