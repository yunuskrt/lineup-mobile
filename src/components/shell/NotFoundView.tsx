import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Screen from '@/components/shell/Screen';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TYPE_NUMBER, TYPE_SECTION } from '@/styles/classes';

type Props = {};

// The web's 404; mobile has no home page, so Play is the way out
const NotFoundView = ({}: Props) => {
  return (
    <Screen canGoBack={router.canGoBack()}>
      <View className="flex-row flex-wrap items-center gap-4">
        <Text
          maxFontSizeMultiplier={1.2}
          className={cn(TYPE_NUMBER, 'text-64')}
        >
          404
        </Text>
        <Badge label="Off the pitch" variant="sticker" tone="butter" />
      </View>
      <Text accessibilityRole="header" className={TYPE_SECTION}>
        Can not find the page
      </Text>
      <Button
        label="Play"
        size="large"
        onPress={() => router.replace('/play')}
      />
    </Screen>
  );
};

export default NotFoundView;
