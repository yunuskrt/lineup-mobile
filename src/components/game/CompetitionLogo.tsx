import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { COMPETITION_KIND_PATH } from '@/components/game/competition-kind';
import { useImageFallback } from '@/hooks/use-image-fallback';
import { ROLES } from '@/styles/tokens';
import type { CompetitionRef } from '@/types/match';

type Props = {
  competition: CompetitionRef;
  size: number;
};

// The logo, or the web's stroked mark for its kind
const CompetitionLogo = ({ competition, size }: Props) => {
  const { showsImage, onError } = useImageFallback(competition.logoUrl);
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      // The caller sets the box at run time
      style={{ width: size, height: size }}
    >
      {showsImage && competition.logoUrl ? (
        <Image
          source={{ uri: competition.logoUrl }}
          contentFit="contain"
          onError={onError}
          // NativeWind can't style expo-image: fill the box by style
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={ROLES.fg}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d={COMPETITION_KIND_PATH[competition.kind]} />
        </Svg>
      )}
    </View>
  );
};

export default CompetitionLogo;
