import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import AuthPanel from '@/components/auth/AuthPanel';
import Screen from '@/components/shell/Screen';
import { useSession } from '@/hooks/use-auth';
import { authModeFrom } from '@/lib/auth';

const TITLES = { 'sign-in': 'Sign in', 'sign-up': 'Create account' } as const;

type Props = {};

const SignInScreen = ({}: Props) => {
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const mode = authModeFrom(modeParam);
  const user = useSession().data?.user;
  const title = user && !user.isGuest ? 'Signed in' : TITLES[mode];

  return (
    <Screen title={title} canGoBack avoidsKeyboard>
      <AuthPanel mode={mode} />
    </Screen>
  );
};

export default SignInScreen;
