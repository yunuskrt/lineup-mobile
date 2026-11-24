import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { UserRound } from 'lucide-react-native';
import RetryNotice from '@/components/shell/RetryNotice';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';

type Props =
  | { kind: 'signedOut' }
  | { kind: 'error'; message: string; onRetry: () => void };

const ProfileNotice = (props: Props) => {
  if (props.kind === 'error') {
    return (
      <RetryNotice
        title="Couldn’t load your profile"
        message={props.message}
        onRetry={props.onRetry}
      />
    );
  }

  return (
    <StateNotice
      tone="info"
      icon={UserRound}
      title="No profile yet"
      message="Play a game and your history starts here. No account needed."
    >
      <View className="w-full gap-3">
        <Button
          label="Play"
          size="large"
          onPress={() => router.navigate('/play')}
        />
        <Button
          label="Sign in"
          size="large"
          variant="secondary"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    </StateNotice>
  );
};

export default ProfileNotice;
