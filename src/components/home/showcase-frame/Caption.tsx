import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { showcaseCaption, showcaseSentence } from '@/lib/landing';
import type { Showcase } from '@/types/catalog';

type Props = {
  showcase: Showcase;
  control?: ReactNode;
};

// The caption speaks for the hidden stage, in one sentence
const Caption = ({ showcase, control }: Props) => {
  return (
    <View className="min-h-11 flex-row items-center justify-between gap-4">
      <Text
        accessibilityLabel={showcaseSentence(showcase)}
        className="min-w-0 flex-1 text-14 text-fg-muted"
      >
        {showcaseCaption(showcase)}
      </Text>
      {control}
    </View>
  );
};

export default Caption;
