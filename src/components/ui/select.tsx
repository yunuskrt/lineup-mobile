import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { SELECT_TRIGGER } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { toggleId } from '@/lib/filters';
import { pressHaptic } from '@/lib/haptics';
import { filterOptions, needsSearch, selectValueLabel } from '@/lib/select';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';
import type { SelectOption } from '@/types/select';

type Props = {
  label: string;
  options: readonly SelectOption[];
  selected: readonly string[];
  onChange: (selected: string[]) => void;
  anyLabel?: string;
  searchPlaceholder?: string;
  isDisabled?: boolean;
};

// A select row that opens a bottom sheet of options
export const Select = ({
  label,
  options,
  selected,
  onChange,
  anyLabel = 'Any',
  searchPlaceholder = 'Search',
  isDisabled = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const isLong = needsSearch(options);
  const shown = filterOptions(options, query);

  const close = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        onPressIn={pressHaptic}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectValueLabel(selected, options, anyLabel)}`}
        className={cn(
          SELECT_TRIGGER,
          'bg-surface-card active:bg-surface-raised',
          isDisabled && 'opacity-70',
        )}
      >
        <Text className="font-body-medium text-14">{label}</Text>
        <View className="flex-1 flex-row items-center justify-end gap-2">
          <Text numberOfLines={1} className="flex-shrink text-14 text-fg-muted">
            {selectValueLabel(selected, options, anyLabel)}
          </Text>
          {selected.length > 1 ? (
            <Badge label={String(selected.length)} tone="brand" />
          ) : null}
          <ChevronDown size={18} strokeWidth={2.5} color={ROLES.fg} />
        </View>
      </Pressable>

      <Sheet isOpen={isOpen} onClose={close} title={label} isTall={isLong}>
        {isLong ? (
          <Input
            placeholder={searchPlaceholder}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            accessibilityLabel={searchPlaceholder}
          />
        ) : null}
        <ScrollView
          keyboardShouldPersistTaps="always"
          className={cn(isLong && 'flex-1')}
        >
          {shown.map((option) => (
            <View key={option.id} className="border-b-2 border-rule py-3">
              <Checkbox
                label={option.label}
                isChecked={selected.includes(option.id)}
                onChange={() =>
                  onChange(toggleId(selected, option.id, options))
                }
              />
            </View>
          ))}
          {shown.length === 0 ? (
            <Text className="py-3 text-14 text-fg-muted">No matches</Text>
          ) : null}
        </ScrollView>
      </Sheet>
    </>
  );
};
