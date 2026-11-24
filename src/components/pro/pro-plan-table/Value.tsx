import React from 'react';
import { View } from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

type Props = { value: string | null; isPro: boolean };

// Marks beside the words; the row's label carries the meaning
const Value = ({ value, isPro }: Props) => {
  const color = isPro ? ROLES['on-accent'] : ROLES['fg-muted'];
  if (value === null) {
    return (
      <View className="mt-0.5">
        <Minus size={16} strokeWidth={2.5} color={color} />
      </View>
    );
  }
  return (
    <View className="flex-row items-start gap-1.5">
      {isPro ? (
        <View className="mt-0.5">
          <Check size={16} strokeWidth={3} color={color} />
        </View>
      ) : null}
      <Text
        className={cn(
          'flex-1 text-14 leading-5',
          isPro ? 'text-on-accent' : 'text-fg-muted',
        )}
      >
        {value}
      </Text>
    </View>
  );
};

export default Value;
