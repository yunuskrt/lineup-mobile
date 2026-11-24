import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import OptionRow from '@/components/play/filter-panel/OptionRow';
import SheetChip from '@/components/play/SheetChip';
import { FILTER_LABEL } from '@/components/play/styles';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { effectiveSeasons, seasonLabel } from '@/lib/filters';
import type { FilterPanelProps } from '@/components/play/FilterPanel';

type Props = FilterPanelProps & {
  // The era as the summary reads it, "Any season" when open
  value: string;
};

// One sheet, two columns: "to" starts at "From", as on /play
const EraChip = ({ options, filters, onChange, value }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { era } = filters;
  const seasons = effectiveSeasons(filters, options);
  const columns = [
    {
      label: 'From',
      picked: era.from,
      seasons,
      pick: (from: number) =>
        onChange({ ...filters, era: { from, to: Math.max(from, era.to) } }),
    },
    {
      label: 'To',
      picked: era.to,
      seasons: seasons.filter((season) => season >= era.from),
      pick: (to: number) => onChange({ ...filters, era: { ...era, to } }),
    },
  ];

  return (
    <>
      <SheetChip
        name="Era"
        value={value}
        isActive={value !== 'Any season'}
        onPress={() => setIsOpen(true)}
      />
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Era"
        isTall
      >
        <View className="flex-1 flex-row gap-4">
          {columns.map((column) => (
            <View key={column.label} className="min-w-0 flex-1 gap-2">
              <Text accessibilityRole="header" className={FILTER_LABEL}>
                {column.label}
              </Text>
              <ScrollView className="flex-1">
                {column.seasons.map((season) => (
                  <OptionRow
                    key={season}
                    label={seasonLabel(season)}
                    kind="radio"
                    isChecked={season === column.picked}
                    onPress={() => column.pick(season)}
                  />
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
        <View className="pt-3">
          <Button label="Done" onPress={() => setIsOpen(false)} />
        </View>
      </Sheet>
    </>
  );
};

export default EraChip;
