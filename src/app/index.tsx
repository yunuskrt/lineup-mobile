import React from 'react';
import { Redirect } from 'expo-router';
import Welcome from '@/components/home/Welcome';
import { hasToken } from '@/lib/api/http/token-store';
import { landsOnWelcome } from '@/lib/welcome';

type Props = {};

// The token was loaded before the splash lifted, so this is current
const IndexScreen = ({}: Props) => {
  if (!landsOnWelcome(hasToken())) return <Redirect href="/play" />;
  return <Welcome />;
};

export default IndexScreen;
