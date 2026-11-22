import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import AuthSkeleton from '@/components/auth/auth-panel/AuthSkeleton';
import ContinueAsGuest from '@/components/auth/ContinueAsGuest';
import ModeSwitch from '@/components/auth/ModeSwitch';
import SignedInPanel from '@/components/auth/SignedInPanel';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import RetryNotice from '@/components/shell/RetryNotice';
import { Text } from '@/components/ui/text';
import { useSession } from '@/hooks/use-auth';
import { authErrorMessageOf } from '@/lib/auth';
import type { AuthMode } from '@/types/auth';

type Props = {
  mode: AuthMode;
};

// The web's AuthPanel: forms wait for the session, as sign-up reads it
const AuthPanel = ({ mode }: Props) => {
  const session = useSession();

  if (session.isPending) return <AuthSkeleton mode={mode} />;
  if (session.isError) {
    return (
      <RetryNotice
        message={authErrorMessageOf(session.error)}
        onRetry={() => session.refetch()}
      />
    );
  }

  const user = session.data?.user ?? null;
  if (user && !user.isGuest) return <SignedInPanel handle={user.handle} />;

  return (
    <View className="gap-6">
      {user ? (
        <Text className="text-16 text-fg-muted">
          You’re playing as{' '}
          <Text className="font-body-medium text-16">{user.handle}</Text>.
          {mode === 'sign-up'
            ? ' Create an account to keep your history.'
            : ' Signing in to another account leaves this guest’s games behind.'}
        </Text>
      ) : null}
      {/* A full-bleed colour band, not a box */}
      <View className="-mx-4 gap-5 border-y-2 border-line bg-block-mint px-4 py-6">
        <ModeSwitch mode={mode} />
        {mode === 'sign-in' ? <SignInForm /> : <SignUpForm />}
      </View>
      {user ? null : (
        <ContinueAsGuest onDone={() => router.dismissTo('/play')} />
      )}
    </View>
  );
};

export default AuthPanel;
