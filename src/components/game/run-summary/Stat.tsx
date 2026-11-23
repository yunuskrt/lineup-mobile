import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { SECTION_LABEL, TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';

const MAX_FONT_SCALE = 1.2;

type Props = {
  label: string;
  value: string;
  // The first half carries the rule between the two
  isFirst?: boolean;
};

const Stat = ({ label, value, isFirst = false }: Props) => {
  return (
    <View
      accessible
      accessibilityLabel={`${label}, ${value}`}
      className={cn(
        'flex-1 justify-center gap-0.5',
        isFirst ? 'border-r-2 border-line pr-4' : 'pl-4',
      )}
    >
      <Text className={SECTION_LABEL}>{label}</Text>
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        className={`${TYPE_NUMBER} text-30 leading-8 text-fg`}
        // fontVariant: NativeWind can't reach tabular figures
        style={TABULAR_NUMS}
      >
        {value}
      </Text>
    </View>
  );
};

export default Stat;
