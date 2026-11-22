import React from 'react';
import { View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useContinueAsGuest } from '@/hooks/use-auth';
import { authErrorMessageOf } from '@/lib/auth';

type Props = {
  // The welcome leads with this; the sign-in screen offers it below
  isPrimary?: boolean;
  onDone: () => void;
};

const ContinueAsGuest = ({ isPrimary = false, onDone }: Props) => {
  const continueAsGuest = useContinueAsGuest();

  const start = async () => {
    try {
      await continueAsGuest.mutateAsync();
      onDone();
    } catch {
      // Shown through continueAsGuest.error
    }
  };

  return (
    <View className="gap-3">
      {isPrimary ? null : (
        <Text className="text-14 text-fg-muted">
          No account needed to play.
        </Text>
      )}
      {continueAsGuest.error && !continueAsGuest.isPending ? (
        <Alert tone="warning" icon={TriangleAlert}>
          {authErrorMessageOf(continueAsGuest.error)}
        </Alert>
      ) : null}
      <Button
        label={continueAsGuest.isPending ? 'Continuing…' : 'Continue as guest'}
        variant={isPrimary ? 'primary' : 'secondary'}
        size={isPrimary ? 'large' : 'default'}
        isBusy={continueAsGuest.isPending}
        onPress={start}
      />
    </View>
  );
};

export default ContinueAsGuest;
