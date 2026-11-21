import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import PlaceholderScreen from '@/components/shell/PlaceholderScreen';
import { Button } from '@/components/ui/button';

type Props = {};

// Until M13, a way to reach every shell route by tapping
const PlayScreen = ({}: Props) => {
  return (
    <PlaceholderScreen title="Play" builtIn="M13: the play setup" hasTabBar>
      <View className="gap-3">
        <Button label="Solo run" onPress={() => router.push('/play/solo')} />
        <Button label="Duel" onPress={() => router.push('/play/duel')} />
        <Button
          label="Sign in"
          variant="secondary"
          onPress={() => router.push('/sign-in')}
        />
        <Button
          label="Pro"
          variant="secondary"
          onPress={() => router.push('/pro')}
        />
      </View>
    </PlaceholderScreen>
  );
};

export default PlayScreen;
