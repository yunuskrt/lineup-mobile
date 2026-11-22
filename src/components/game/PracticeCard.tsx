import React from 'react';
import { View } from 'react-native';
import { TimerOff } from 'lucide-react-native';
import { IconTile } from '@/components/ui/icon-tile';
import { Text } from '@/components/ui/text';
import { TYPE_CARD_TITLE } from '@/styles/classes';

type Props = {};

// Where the ring and the lives sit in a timed run
const PracticeCard = ({}: Props) => {
  return (
    <View className="flex-row items-start gap-3 border-b-2 border-line pb-3">
      <View accessibilityElementsHidden importantForAccessibility="no">
        <IconTile icon={TimerOff} className="bg-block-mint" />
      </View>
      <View className="flex-1 gap-1">
        <Text accessibilityRole="header" className={TYPE_CARD_TITLE}>
          Practice
        </Text>
        <Text className="text-14 text-fg-muted">
          No clock and no lives. Name all eleven, or quit when you like. This
          run isn&apos;t saved.
        </Text>
      </View>
    </View>
  );
};

export default PracticeCard;
