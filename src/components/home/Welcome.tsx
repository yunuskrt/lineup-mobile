import React from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ContinueAsGuest from '@/components/auth/ContinueAsGuest';
import HomeFold from '@/components/home/HomeFold';
import HomeRules from '@/components/home/HomeRules';
import { Button } from '@/components/ui/button';

const EDGE_GAP = 16;

type Props = {};

// First launch: what the game is, then a guest start or a sign-in
const Welcome = ({}: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        // The top inset is known only at run time
        contentContainerStyle={{ paddingTop: insets.top + EDGE_GAP }}
      >
        <View className="gap-8 px-4 pb-6">
          <HomeFold />
          <View className="h-0.5 bg-line" />
          <HomeRules />
        </View>
      </ScrollView>
      <View
        className="gap-3 border-t-2 border-line bg-surface px-4 pt-4"
        // The home indicator's inset is known only at run time
        style={{ paddingBottom: insets.bottom + EDGE_GAP }}
      >
        <ContinueAsGuest isPrimary onDone={() => router.replace('/play')} />
        <Button
          label="Sign in"
          variant="secondary"
          size="large"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    </View>
  );
};

export default Welcome;
