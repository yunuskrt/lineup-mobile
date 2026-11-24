import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProStatePreview } from '@/components/dev/ProStatePreview';
import ProScreen from '@/components/pro/ProScreen';

type Props = {};

const ProRoute = ({}: Props) => {
  const { state } = useLocalSearchParams<{ state?: string }>();
  // ?state= previews a sample in development only
  if (__DEV__ && state !== undefined) {
    return <ProStatePreview key={state} state={state} />;
  }
  return <ProScreen />;
};

export default ProRoute;
