import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, ScrollView } from 'react-native';
import ClubChipImage from '@/components/play/filter-panel/ClubChipImage';
import FilterRow from '@/components/play/filter-panel/FilterRow';
import OptionRow from '@/components/play/filter-panel/OptionRow';
import SheetTrigger from '@/components/play/filter-panel/SheetTrigger';
import type { FilterPanelProps } from '@/components/play/FilterPanel';
import { FILTER_NOTE } from '@/components/play/styles';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { clubRowView, toggleId } from '@/lib/filters';
import { pluralOf } from '@/lib/plural';
import { selectValueLabel } from '@/lib/select';

const CLUB_HINT = 'Pick a competition to see its clubs, or search for one.';

function countLabel(count: number): string {
  return `${count} ${pluralOf(count, 'club', 'clubs')} found`;
}

type Props = FilterPanelProps;

// Keyed by competition: a new pick clears it
const ClubFilter = ({ options, filters, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const view = clubRowView(filters, options, query);
  const clubOptions = options.clubs.map((club) => ({
    id: club.id,
    label: club.name,
  }));

  // The web's live region: the count, read as it changes
  const announced = view.matchCount === null ? '' : countLabel(view.matchCount);
  useEffect(() => {
    if (announced) AccessibilityInfo.announceForAccessibility(announced);
  }, [announced]);

  const close = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <FilterRow label="Club">
      <SheetTrigger
        name="Club"
        value={selectValueLabel(filters.clubIds, clubOptions)}
        count={filters.clubIds.length}
        onPress={() => setIsOpen(true)}
      />
      <Sheet isOpen={isOpen} onClose={close} title="Club" isTall>
        {view.hasSearch ? (
          <Input
            placeholder="Search clubs"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Search clubs"
            accessibilityHint={view.isSearchingAll ? CLUB_HINT : undefined}
          />
        ) : null}
        {view.isSearchingAll ? (
          <Text className={FILTER_NOTE}>{CLUB_HINT}</Text>
        ) : null}
        <ScrollView keyboardShouldPersistTaps="always" className="flex-1">
          <OptionRow
            label="Any club"
            kind="checkbox"
            isChecked={filters.clubIds.length === 0}
            onPress={() => onChange({ ...filters, clubIds: [] })}
          />
          {view.clubs.map((club) => (
            <OptionRow
              key={club.id}
              label={club.name}
              kind="checkbox"
              isChecked={filters.clubIds.includes(club.id)}
              image={<ClubChipImage club={club} />}
              onPress={() =>
                onChange({
                  ...filters,
                  clubIds: toggleId(filters.clubIds, club.id, options.clubs),
                })
              }
            />
          ))}
          {view.matchCount === 0 ? (
            <Text className={`${FILTER_NOTE} py-3`}>
              No club matches that name.
            </Text>
          ) : null}
          {view.moreCount > 0 ? (
            <Text className={`${FILTER_NOTE} py-3`}>
              {view.moreCount} more. Keep typing to narrow it down.
            </Text>
          ) : null}
        </ScrollView>
      </Sheet>
    </FilterRow>
  );
};

export default ClubFilter;
