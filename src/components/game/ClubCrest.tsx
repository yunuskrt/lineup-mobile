import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/components/ui/text';
import { useImageFallback } from '@/hooks/use-image-fallback';
import { cn } from '@/lib/utils';
import type { ClubRef } from '@/types/match';

export type CrestSize = 'row' | 'header' | 'card';

// 32, 40 and 80: a three-letter short name fits the header's 40
const BOX: Record<CrestSize, string> = {
  row: 'h-8 w-8',
  header: 'h-10 w-10',
  card: 'h-20 w-20',
};

const FALLBACK_TEXT: Record<CrestSize, string> = {
  row: 'text-12',
  header: 'text-12',
  card: 'text-16',
};

// White vanishes on a white surface; peach shows
const FALLBACK_FILL = {
  card: 'bg-surface-card',
  raised: 'bg-surface-raised',
} as const;

type Props = {
  club: ClubRef;
  // Rings the crest of the XI being named
  isNamed?: boolean;
  size?: CrestSize;
  fallbackFill?: keyof typeof FALLBACK_FILL;
};

// The crest from the CDN, or the short name when there's none
const ClubCrest = ({
  club,
  isNamed = false,
  size = 'header',
  fallbackFill = 'card',
}: Props) => {
  const { showsImage, onError } = useImageFallback(club.crestUrl);
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn(
        'items-center justify-center overflow-hidden rounded-sm border-2',
        BOX[size],
        isNamed ? 'border-fg' : 'border-transparent',
      )}
    >
      {showsImage && club.crestUrl ? (
        <Image
          source={{ uri: club.crestUrl }}
          contentFit="contain"
          onError={onError}
          // NativeWind can't style expo-image: fill the box by style
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          className={cn(
            'h-full w-full items-center justify-center',
            FALLBACK_FILL[fallbackFill],
          )}
        >
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1}
            className={cn(
              'px-0.5 font-body-semibold text-fg-muted',
              FALLBACK_TEXT[size],
            )}
          >
            {club.shortName}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ClubCrest;
