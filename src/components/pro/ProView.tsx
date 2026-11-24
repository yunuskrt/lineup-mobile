import React from 'react';
import { View } from 'react-native';
import GetProButton from '@/components/pro/GetProButton';
import ProPlanTable from '@/components/pro/ProPlanTable';
import { leavePro } from '@/components/pro/shared';
import Screen from '@/components/shell/Screen';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import type { ProPlan } from '@/types/pro-plan';

const LINE =
  'More solo: pick any match, practise it, play without a daily limit.';

type Props = { plan: ProPlan };

const ProView = ({ plan }: Props) => {
  return (
    <Screen
      canGoBack
      onBack={leavePro}
      footer={
        // Same height in every plan, so nothing shifts
        <View className="min-h-21 justify-center">
          {plan === 'free' ? <GetProButton /> : null}
          {plan === 'pro' ? (
            <View
              accessible
              accessibilityLabel="You have Pro."
              accessibilityLiveRegion="polite"
            >
              <Badge label="You have Pro." variant="sticker" tone="brand" />
            </View>
          ) : null}
        </View>
      }
    >
      {/* The sticker names the page; there is no title */}
      <View className="items-start gap-3">
        <Badge label="Pro" variant="sticker" tone="brand" />
        <Text className="text-16 leading-6 text-fg-muted">{LINE}</Text>
      </View>
      <View className="border-t-2 border-line pt-6">
        <ProPlanTable />
      </View>
    </Screen>
  );
};

export default ProView;
