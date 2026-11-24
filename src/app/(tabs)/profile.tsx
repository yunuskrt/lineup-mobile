import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProfileStatePreview } from '@/components/dev/ProfileStatePreview';
import ProfileScreen from '@/components/profile/ProfileScreen';

type Props = {};

const ProfileRoute = ({}: Props) => {
  const { state } = useLocalSearchParams<{ state?: string }>();
  // ?state= previews a sample in development only
  if (__DEV__ && state !== undefined) {
    return <ProfileStatePreview key={state} state={state} />;
  }
  return <ProfileScreen />;
};

export default ProfileRoute;
