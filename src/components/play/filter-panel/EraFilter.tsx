import React from 'react';
import { View } from 'react-native';
import FilterRow from '@/components/play/filter-panel/FilterRow';
import SeasonSelect from '@/components/play/filter-panel/SeasonSelect';
import type { FilterPanelProps } from '@/components/play/FilterPanel';
import { effectiveSeasons } from '@/lib/filters';

type Props = FilterPanelProps;

// "to" starts at "From"; moving "From" past it pulls it along
const EraFilter = ({ options, filters, onChange }: Props) => {
  const { era } = filters;
  const seasons = effectiveSeasons(filters, options);

  return (
    <FilterRow label="Era">
      <View className="flex-row items-center gap-3">
        <SeasonSelect
          label="From"
          name="Era from"
          value={era.from}
          seasons={seasons}
          onChange={(from) =>
            onChange({ ...filters, era: { from, to: Math.max(from, era.to) } })
          }
        />
        <SeasonSelect
          label="to"
          name="Era to"
          value={era.to}
          seasons={seasons.filter((season) => season >= era.from)}
          onChange={(to) => onChange({ ...filters, era: { ...era, to } })}
        />
      </View>
    </FilterRow>
  );
};

export default EraFilter;
