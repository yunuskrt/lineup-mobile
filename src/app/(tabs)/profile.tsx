import React from 'react';
import { router } from 'expo-router';
import PlaceholderScreen from '@/components/shell/PlaceholderScreen';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-auth';

type Props = {};

// Until M19: a way to sign in, or to upgrade a guest
const ProfileScreen = ({}: Props) => {
  const user = useSession().data?.user;
  return (
    <PlaceholderScreen title="Profile" builtIn="M19: the profile" hasTabBar>
      {user && !user.isGuest ? (
        <Button
          label="Signed in"
          variant="secondary"
          onPress={() => router.push('/sign-in')}
        />
      ) : (
        <Button
          label={user ? 'Create account' : 'Sign in'}
          onPress={() =>
            router.push(user ? '/sign-in?mode=sign-up' : '/sign-in')
          }
        />
      )}
    </PlaceholderScreen>
  );
};

export default ProfileScreen;
