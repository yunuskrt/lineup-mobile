import React from 'react';
import { View } from 'react-native';
import FilterPanel from '@/components/play/FilterPanel';
import FilterSkeleton from '@/components/play/FilterSkeleton';
import StepHeading from '@/components/play/StepHeading';
import { STEP_INTRO, STEP_SECTION } from '@/components/play/styles';
import RetryNotice from '@/components/shell/RetryNotice';
import { Text } from '@/components/ui/text';
import { authErrorMessageOf } from '@/lib/auth';
import type { FilterOptions } from '@/types/catalog';
import type { Filters } from '@/types/filters';

type Props = {
  filters: Filters | null;
  options: FilterOptions | null;
  onChange: (filters: Filters) => void;
  error: unknown;
  onRetry: () => void;
  isHeadingFocused: boolean;
};

// Back and Next: start sit in the screen's footer
const FiltersStep = ({
  filters,
  options,
  onChange,
  error,
  onRetry,
  isHeadingFocused,
}: Props) => {
  return (
    <View className={STEP_SECTION}>
      <View className="gap-2">
        <StepHeading
          title="Choose filters"
          isFocusedOnMount={isHeadingFocused}
        />
        <Text className={STEP_INTRO}>
          Choose where the match comes from. Leave a group on Any to include all
          of it.
        </Text>
      </View>
      {/* A failed background refetch keeps its data */}
      {filters && options ? (
        <FilterPanel options={options} filters={filters} onChange={onChange} />
      ) : error ? (
        <RetryNotice message={authErrorMessageOf(error)} onRetry={onRetry} />
      ) : (
        <FilterSkeleton />
      )}
    </View>
  );
};

export default FiltersStep;
