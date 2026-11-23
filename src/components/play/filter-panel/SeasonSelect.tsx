import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import OptionRow from '@/components/play/filter-panel/OptionRow';
import SheetTrigger from '@/components/play/filter-panel/SheetTrigger';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { seasonLabel } from '@/lib/filters';
import { SELECT_SEARCH_FROM } from '@/lib/select';

type Props = {
  // Shown beside the row: "From" or "to"
  label: string;
  // Read aloud and on the sheet: "Era from"
  name: string;
  value: number;
  seasons: number[];
  onChange: (season: number) => void;
};

// A single pick of one season; a pick closes the sheet
const SeasonSelect = ({ label, name, value, seasons, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLong = seasons.length >= SELECT_SEARCH_FROM;

  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-3">
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no"
        className="text-14 text-fg-muted"
      >
        {label}
      </Text>
      <View className="min-w-0 flex-1">
        <SheetTrigger
          name={name}
          value={seasonLabel(value)}
          onPress={() => setIsOpen(true)}
        />
      </View>
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={name}
        isTall={isLong}
      >
        <ScrollView className={isLong ? 'flex-1' : ''}>
          {seasons.map((season) => (
            <OptionRow
              key={season}
              label={seasonLabel(season)}
              kind="radio"
              isChecked={season === value}
              onPress={() => {
                onChange(season);
                setIsOpen(false);
              }}
            />
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
};

export default SeasonSelect;
