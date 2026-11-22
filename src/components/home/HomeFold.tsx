import React from 'react';
import { View } from 'react-native';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TYPE_DISPLAY, TYPE_NUMBER } from '@/styles/classes';

type Props = {};

// The web's fold: the wordmark, the statement and its sticker
const HomeFold = ({}: Props) => {
  return (
    <View className="gap-6">
      <Text maxFontSizeMultiplier={1.2} className={cn(TYPE_NUMBER, 'text-24')}>
        Lineup
      </Text>
      <View accessible accessibilityRole="header" className="items-start gap-3">
        <Text className={TYPE_DISPLAY}>Know the XI.</Text>
        <View className="-rotate-3">
          <ShadowBox
            depth="hard-sm"
            radiusClassName="rounded-sm"
            className="border-2 border-line bg-block-butter px-2 py-1"
          >
            <Text className={TYPE_DISPLAY}>Guess the Squad.</Text>
          </ShadowBox>
        </View>
      </View>
      <Text className="text-16 text-fg-muted">
        You get one team from a real match. Name its starting eleven before the
        clock runs down.
      </Text>
    </View>
  );
};

export default HomeFold;
