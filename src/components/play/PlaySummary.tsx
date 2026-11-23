import React from 'react';
import { View } from 'react-native';
import Rows, { type Row } from '@/components/play/play-summary/Rows';
import { Button } from '@/components/ui/button';
import { filterSummary } from '@/lib/lobby';
import { MODE_OPTION_NAMES, type PlayStep } from '@/lib/play-steps';
import type { FilterOptions } from '@/types/catalog';
import type { Filters } from '@/types/filters';
import type { ModeOption } from '@/types/play';

type Props = {
  option: ModeOption;
  // Null while the filters load
  filters: Filters | null;
  options: FilterOptions | null;
  onEdit: (step: PlayStep) => void;
};

const FILTER_LABELS = ['Competition', 'Club', 'Era'];

const GROUP = 'flex-row items-start justify-between gap-4';

const PlaySummary = ({ option, filters, options, onEdit }: Props) => {
  const filterRows: Row[] =
    filters && options
      ? filterSummary(filters, options)
      : FILTER_LABELS.map((label) => ({ label, value: null }));

  return (
    <View>
      <View className={`${GROUP} pb-4`}>
        <Rows rows={[{ label: 'Mode', value: MODE_OPTION_NAMES[option] }]} />
        <View className="flex-shrink-0">
          <Button
            label="Edit mode"
            variant="secondary"
            onPress={() => onEdit('mode')}
          />
        </View>
      </View>
      <View className={`${GROUP} border-t-2 border-line pt-4`}>
        <Rows rows={filterRows} />
        <View className="flex-shrink-0">
          <Button
            label="Edit filters"
            variant="secondary"
            onPress={() => onEdit('filters')}
          />
        </View>
      </View>
    </View>
  );
};

export default PlaySummary;
