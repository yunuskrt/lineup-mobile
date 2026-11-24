import React from 'react';
import { View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSignOut } from '@/hooks/use-auth';
import { authErrorMessageOf } from '@/lib/auth';

type Props = {};

// Ends the column; signed out, the screen shows its notice
const SignOut = ({}: Props) => {
  const signOut = useSignOut();
  return (
    <View className="gap-4">
      {signOut.error && !signOut.isPending ? (
        <Alert tone="warning" icon={TriangleAlert}>
          {authErrorMessageOf(signOut.error)}
        </Alert>
      ) : null}
      <Button
        label={signOut.isPending ? 'Signing out…' : 'Sign out'}
        variant="secondary"
        isBusy={signOut.isPending}
        onPress={() => signOut.mutate()}
      />
    </View>
  );
};

export default SignOut;
