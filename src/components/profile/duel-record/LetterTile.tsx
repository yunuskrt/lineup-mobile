import React from 'react';
import { View } from 'react-native';
import { LETTER, LETTER_TILE } from '@/components/profile/styles';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type Tile = 'win' | 'draw' | 'loss';

const TILE_LETTERS: Record<Tile, string> = { win: 'W', draw: 'D', loss: 'L' };

const TILE_FILLS: Record<Exclude<Tile, 'draw'>, string> = {
  win: 'bg-you',
  loss: 'bg-danger',
};

// A fixed-size piece: the letter must fit its tile
const MAX_FONT_SCALE = 1;

type Props = { tile: Tile; isMuted: boolean };

// Decorative: the label beside it is read
const LetterTile = ({ tile, isMuted }: Props) => {
  const fill = isMuted
    ? 'bg-surface-card'
    : tile === 'draw'
      ? undefined
      : TILE_FILLS[tile];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn(LETTER_TILE, fill)}
    >
      {/* A draw is shared, so it shows both colours */}
      {!isMuted && tile === 'draw' ? (
        <View className="absolute inset-0 flex-row">
          <View className="flex-1 bg-you" />
          <View className="flex-1 bg-opponent" />
        </View>
      ) : null}
      <Text maxFontSizeMultiplier={MAX_FONT_SCALE} className={LETTER}>
        {TILE_LETTERS[tile]}
      </Text>
    </View>
  );
};

export default LetterTile;
