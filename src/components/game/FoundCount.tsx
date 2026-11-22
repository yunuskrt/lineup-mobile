import React from 'react';
import { View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { foundCountLabel } from '@/lib/canvas';
import type { FoundPlayer } from '@/types/player';

// A fixed game piece: larger text would cover the turf's slots
const MAX_FONT_SCALE = 1.2;

type Props = { found: FoundPlayer[] };

// Sits on the turf's corner, over the pitch
const FoundCount = ({ found }: Props) => {
  const count = foundCountLabel(found);

  return (
    <View
      accessible
      accessibilityLabel={count.spoken}
      className="absolute left-2 top-2 z-10"
    >
      <Badge
        variant="sticker"
        label={count.label}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      />
    </View>
  );
};

export default FoundCount;
