import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { TriangleAlert } from 'lucide-react-native';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/hooks/use-auth';
import { authErrorMessageOf } from '@/lib/auth';

type Props = {
  handle: string;
};

const SignedInPanel = ({ handle }: Props) => {
  const signOut = useSignOut();
  return (
    <View className="gap-6">
      <View className="flex-row items-center gap-3">
        <Avatar name={handle} size="lg" />
        <Text className="flex-1 text-16 text-fg-muted">
          You’re playing as{' '}
          <Text className="font-body-medium text-16">{handle}</Text>.
        </Text>
      </View>
      {signOut.error && !signOut.isPending ? (
        <Alert tone="warning" icon={TriangleAlert}>
          {authErrorMessageOf(signOut.error)}
        </Alert>
      ) : null}
      <View className="gap-3">
        <Button
          label="Play"
          size="large"
          onPress={() => router.dismissTo('/play')}
        />
        <Button
          label={signOut.isPending ? 'Signing out…' : 'Sign out'}
          variant="secondary"
          isBusy={signOut.isPending}
          onPress={() => signOut.mutate()}
        />
      </View>
    </View>
  );
};

export default SignedInPanel;
