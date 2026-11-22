import React from 'react';
import { View } from 'react-native';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';

type Props = {
  count: string;
  label: string;
  text: string;
  fill: string;
  // Short screens keep the number and label, not the sentence
  isShort: boolean;
};

const RuleTile = ({ count, label, text, fill, isShort }: Props) => {
  return (
    <ShadowBox
      depth="hard-sm"
      className={cn(
        'flex-row items-center gap-4 border-2 border-line px-4',
        isShort ? 'py-2' : 'py-3',
        fill,
      )}
    >
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        className={cn(TYPE_NUMBER, 'w-20 text-30')}
        // fontVariant: NativeWind can't reach tabular figures
        style={TABULAR_NUMS}
      >
        {count}
      </Text>
      <View className="flex-1 gap-0.5">
        <Text className="font-body-semibold text-14">{label}</Text>
        {isShort ? null : <Text className="text-14">{text}</Text>}
      </View>
    </ShadowBox>
  );
};

export default RuleTile;
