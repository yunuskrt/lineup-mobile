import React from 'react';
import { View } from 'react-native';
import Value from '@/components/pro/pro-plan-table/Value';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { PRO_ROWS, proRowLabel } from '@/lib/pro-plan';

const ROW = 'flex-row border-b-2 border-line';
const CELL = 'px-3 py-3';
const FEATURE_CELL = cn(CELL, 'w-[38%]');
const FREE_CELL = cn(CELL, 'w-[28%]');

// The Pro column takes the rest: its check needs the room
const PRO_CELL = cn(CELL, 'flex-1 bg-block-lavender');

const HEAD = 'font-body-semibold text-14 leading-5';

type Props = {};

const ProPlanTable = ({}: Props) => {
  return (
    <View className="overflow-hidden rounded-lg border-2 border-line bg-surface-card">
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel="Free and Pro compared"
        className={ROW}
      >
        <View className={FEATURE_CELL} />
        <View className={FREE_CELL}>
          <Text className={cn(HEAD, 'text-fg-muted')}>Free</Text>
        </View>
        <View className={PRO_CELL}>
          <Text className={cn(HEAD, 'text-on-accent')}>Pro</Text>
        </View>
      </View>
      {PRO_ROWS.map((row, index) => (
        <View
          key={row.feature}
          accessible
          accessibilityLabel={proRowLabel(row)}
          className={cn(ROW, index === PRO_ROWS.length - 1 && 'border-b-0')}
        >
          <View className={FEATURE_CELL}>
            <Text className="font-body-medium text-14 leading-5">
              {row.feature}
            </Text>
          </View>
          <View className={FREE_CELL}>
            <Value value={row.free} isPro={false} />
          </View>
          <View className={PRO_CELL}>
            <Value value={row.pro} isPro />
          </View>
        </View>
      ))}
    </View>
  );
};

export default ProPlanTable;
