import React from 'react';
import { View } from 'react-native';
import SkeletonRow from '@/components/play/filter-skeleton/SkeletonRow';
import { Skeleton } from '@/components/ui/skeleton';

// A select row is h-12 at radius md
const ROW = 'h-12 rounded-md';

type Props = {};

// The panel's three rows at their real height
const FilterSkeleton = ({}: Props) => {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="gap-4"
    >
      <SkeletonRow label="w-24">
        <Skeleton className={ROW} />
      </SkeletonRow>
      <SkeletonRow label="w-10">
        <Skeleton className={ROW} />
      </SkeletonRow>
      <SkeletonRow label="w-8">
        <View className="flex-row items-center gap-3">
          <Skeleton className="h-5 w-9" />
          <Skeleton className={`${ROW} flex-1`} />
          <Skeleton className="h-5 w-4" />
          <Skeleton className={`${ROW} flex-1`} />
        </View>
      </SkeletonRow>
    </View>
  );
};

export default FilterSkeleton;
