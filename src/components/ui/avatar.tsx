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
  // A size known only at run time, e.g. a disc on the pitch
  diameter?: number;
  // Hidden from screen readers when a parent names the player
  isDecorative?: boolean;
  className?: string;
};

// Initials at 36% of the disc, as the web's pitch draws them
const INITIALS_SHARE = 0.36;

// A photo over initials; initials alone when there's none
export const Avatar = ({
  name,
  source,
  size = 'default',
  tone = 'neutral',
  diameter,
  isDecorative = false,
  className,
}: Props) => {
  const [hasFailed, setHasFailed] = useState(false);
  const showsImage = Boolean(source) && !hasFailed;
  return (
    <View
      accessible={!isDecorative}
      accessibilityRole={isDecorative ? undefined : 'image'}
      accessibilityLabel={isDecorative ? undefined : name}
      importantForAccessibility={isDecorative ? 'no-hide-descendants' : 'auto'}
      className={cn(
        'items-center justify-center overflow-hidden rounded-full border-2 border-line',
        diameter === undefined && AVATAR_SIZE[size],
        AVATAR_TONE[tone],
        className,
      )}
      // A run-time diameter, when the caller sizes the circle
      style={
        diameter === undefined
          ? undefined
          : { width: diameter, height: diameter }
      }
    >
      {/* Initials sit under the photo: shown while it loads or fails */}
      <Text
        maxFontSizeMultiplier={diameter === undefined ? undefined : 1}
        className={cn(AVATAR_LABEL[size], 'text-on-accent')}
        // Initials scale with a run-time diameter, as on the web's pitch
        style={
          diameter === undefined
            ? undefined
            : {
                fontSize: diameter * INITIALS_SHARE,
                lineHeight: diameter * INITIALS_SHARE,
              }
        }
      >
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
