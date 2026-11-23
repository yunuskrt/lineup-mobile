import React from 'react';
import { View } from 'react-native';
import Stat from '@/components/game/run-summary/Stat';
import { STATS_BOX } from '@/components/game/run-summary/styles';
import { accuracyLabel } from '@/lib/summary';
import type { SoloSummary } from '@/types/solo';

type Props = { summary: SoloSummary };

const Stats = ({ summary }: Props) => {
  return (
    <View className={STATS_BOX}>
      <Stat label="Accuracy" value={accuracyLabel(summary.accuracy)} isFirst />
      <Stat label="Best streak" value={String(summary.bestStreak)} />
    </View>
  );
};

export default Stats;
