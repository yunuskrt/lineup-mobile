import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import {
  AVATAR_LABEL,
  AVATAR_SIZE,
  AVATAR_TONE,
  type AvatarSize,
  type AvatarTone,
} from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { initials } from '@/lib/initials';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  source?: ImageProps['source'];
  size?: AvatarSize;
  tone?: AvatarTone;
};

// A photo over initials; initials alone when there's none
export const Avatar = ({
  name,
  source,
  size = 'default',
  tone = 'neutral',
}: Props) => {
  const [hasFailed, setHasFailed] = useState(false);
  const showsImage = Boolean(source) && !hasFailed;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={name}
      className={cn(
        'items-center justify-center overflow-hidden rounded-full border-2 border-line',
        AVATAR_SIZE[size],
        AVATAR_TONE[tone],
      )}
    >
      {/* Initials sit under the photo: shown while it loads or fails */}
      <Text className={cn(AVATAR_LABEL[size], 'text-on-accent')}>
        {initials(name)}
      </Text>
      {showsImage ? (
        <Image
          source={source}
          contentFit="cover"
          onError={() => setHasFailed(true)}
          // NativeWind can't style expo-image: fill the circle by style
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </View>
  );
};
