import React from 'react';
import { View } from 'react-native';
import {
  OUTCOME_BOX,
  STATS_BOX,
  SUMMARY_SECTION,
} from '@/components/game/run-summary/styles';
import { Skeleton } from '@/components/ui/skeleton';

const ROWS = [0, 1, 2];

type Props = {};

// The outcome, the stats and three table rows, at their real sizes
const SummarySkeleton = ({}: Props) => {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading your summary"
    >
      <View className={OUTCOME_BOX}>
        <View className="gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-28" />
        </View>
        <Skeleton className="h-6 w-18" />
      </View>
      <View className={STATS_BOX}>
        <View className="flex-1 justify-center border-r-2 border-line pr-4">
          <Skeleton className="h-10 w-24" />
        </View>
        <View className="flex-1 justify-center pl-4">
          <Skeleton className="h-10 w-24" />
        </View>
      </View>
      <View className={`${SUMMARY_SECTION} gap-1`}>
        <Skeleton className="h-5 w-28" />
        {ROWS.map((row) => (
          <Skeleton key={row} className="my-1 h-8" />
        ))}
      </View>
    </View>
  );
};

export default SummarySkeleton;
