import React from 'react';
import { View } from 'react-native';
import EraChip from '@/components/archive/archive-filters/EraChip';
import ClubFilter from '@/components/play/filter-panel/ClubFilter';
import CompetitionFilter from '@/components/play/filter-panel/CompetitionFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { filterSummary } from '@/lib/lobby';
import { pickedCompetition } from '@/lib/filters';
import type { FilterOptions } from '@/types/catalog';
import type { Filters } from '@/types/filters';

export type ArchiveFilterState = {
  options: FilterOptions;
  filters: Filters;
};

const CHIP_SKELETONS = ['w-32', 'w-20', 'w-16'];

type Props = {
  // Null while the options load
  state: ArchiveFilterState | null;
  onChange: (filters: Filters) => void;
};

// Three chips, each opening its sheet; each reads its own value
const ArchiveFilters = ({ state, onChange }: Props) => {
  if (!state) {
    return (
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Loading filters"
        className="flex-row gap-2"
      >
        {CHIP_SKELETONS.map((width) => (
          <Skeleton key={width} className={`h-8 rounded-full ${width}`} />
        ))}
      </View>
    );
  }

  const { options, filters } = state;
  const picked = pickedCompetition(filters, options);
  const era =
    filterSummary(filters, options).find((line) => line.label === 'Era')
      ?.value ?? 'Any season';
  const props = { options, filters, onChange, isChip: true };

  return (
    <View className="flex-row flex-wrap gap-2">
      <CompetitionFilter {...props} />
      <ClubFilter key={picked?.id ?? 'any'} {...props} />
      <EraChip
        options={options}
        filters={filters}
        onChange={onChange}
        value={era}
      />
    </View>
  );
};

export default ArchiveFilters;
