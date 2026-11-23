import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';

export type Row = { label: string; value: string | null };

type Props = { rows: Row[] };

// Label and value pairs; a value still loading is a skeleton
const Rows = ({ rows }: Props) => {
  return (
    <View className="min-w-0 flex-1 gap-2">
      {rows.map((row) => (
        <View
          key={row.label}
          accessible
          accessibilityLabel={`${row.label}: ${row.value ?? 'Loading'}`}
          className="flex-row items-baseline gap-4"
        >
          <Text className="w-28 text-14 text-fg-muted">{row.label}</Text>
          {row.value === null ? (
            <Skeleton className="h-4 w-28" />
          ) : (
            <Text className="flex-1 font-body-semibold text-16">
              {row.value}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default Rows;
