import React from 'react';
import { View } from 'react-native';
import Lives from '@/components/game/Lives';
import { Text } from '@/components/ui/text';
import { TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';
import type { DuelActor } from '@/types/duel';
import type { Lives as LivesCount } from '@/types/game';

// A fixed-size game piece: the rail keeps its height
const MAX_FONT_SCALE = 1.2;

type Props = {
  lives: LivesCount;
  owner?: DuelActor;
};

// The count beside the shirts; the shirts already say it aloud
const Tally = ({ lives, owner }: Props) => {
  return (
    <View className="flex-row items-center gap-3">
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no"
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        className={`${TYPE_NUMBER} text-30`}
        // fontVariant is beyond NativeWind
        style={TABULAR_NUMS}
      >
        {lives}
      </Text>
      <Lives lives={lives} owner={owner} isLarge />
    </View>
  );
};

export default Tally;
