import React from 'react';
import { View } from 'react-native';
import FilterPanel from '@/components/play/FilterPanel';
import FilterSkeleton from '@/components/play/FilterSkeleton';
import StepHeading from '@/components/play/StepHeading';
import {
  STEP_ACTIONS,
  STEP_INTRO,
  STEP_SECTION,
} from '@/components/play/styles';
import RetryNotice from '@/components/shell/RetryNotice';
import { Button } from '@/components/ui/button';
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
  onBack: () => void;
  onNext: () => void;
  isHeadingFocused: boolean;
};

const FiltersStep = ({
  filters,
  options,
  onChange,
  error,
  onRetry,
  onBack,
  onNext,
  isHeadingFocused,
}: Props) => {
  return (
    <>
      <View className={STEP_SECTION}>
        <View className="gap-2">
          <StepHeading
            title="Choose filters"
            isFocusedOnMount={isHeadingFocused}
          />
          <Text className={STEP_INTRO}>
            Choose where the match comes from. Leave a group on Any to include
            all of it.
          </Text>
        </View>
        {/* A failed background refetch keeps its data */}
        {filters && options ? (
          <FilterPanel
            options={options}
            filters={filters}
            onChange={onChange}
          />
        ) : error ? (
          <RetryNotice message={authErrorMessageOf(error)} onRetry={onRetry} />
        ) : (
          <FilterSkeleton />
        )}
      </View>
      <View className={STEP_SECTION}>
        <View className={STEP_ACTIONS}>
          <Button
            label="Back"
            variant="secondary"
            size="large"
            onPress={onBack}
          />
          <View className="flex-1">
            <Button
              label="Next: start"
              size="large"
              isDisabled={!filters}
              onPress={onNext}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default FiltersStep;
