import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import type { FilterSummary } from '@/types/duel-lobby';

type Props = { summary: FilterSummary };

const SummaryList = ({ summary }: Props) => {
  return (
    <View className="gap-1.5">
      {summary.map((line) => (
        <View key={line.label} className="flex-row gap-4">
          <Text className="w-24 text-14 text-fg-muted">{line.label}</Text>
          <Text className="flex-1 text-14 text-fg">{line.value}</Text>
        </View>
      ))}
    </View>
  );
};

export default SummaryList;
