import React from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';
import { SELECT_TRIGGER } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

type Props = {
  // Read with the value, e.g. "Club: 3 selected"
  name: string;
  value: string;
  // Over one, the kit's count badge
  count?: number;
  onPress: () => void;
};

// The kit Select's row, opening a sheet the filter builds itself
const SheetTrigger = ({ name, value, count = 0, onPress }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressHaptic}
      accessibilityRole="button"
      accessibilityLabel={`${name}: ${value}`}
      className={cn(SELECT_TRIGGER, 'bg-surface-card active:bg-surface-raised')}
    >
      <Text numberOfLines={1} className="flex-shrink text-14">
        {value}
      </Text>
      <View className="flex-row items-center gap-2">
        {count > 1 ? <Badge label={String(count)} tone="brand" /> : null}
        <ChevronDown size={18} strokeWidth={2.5} color={ROLES.fg} />
      </View>
    </Pressable>
  );
};

export default SheetTrigger;
