import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useImageFallback } from '@/hooks/use-image-fallback';

type Props = {
  src: string | null;
  fallback: ReactNode;
};

// A 20pt crest; a missing or broken one shows the fallback
const FilterChipImage = ({ src, fallback }: Props) => {
  const { showsImage, onError } = useImageFallback(src);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="h-5 w-5"
    >
      {showsImage && src ? (
        <Image
          source={{ uri: src }}
          contentFit="contain"
          onError={onError}
          // NativeWind can't style expo-image: fill the box by style
          style={StyleSheet.absoluteFill}
        />
      ) : (
        fallback
      )}
    </View>
  );
};

export default FilterChipImage;
