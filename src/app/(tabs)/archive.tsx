import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ArchiveScreen from '@/components/archive/ArchiveScreen';
import { ArchiveStatePreview } from '@/components/dev/ArchiveStatePreview';

type Props = {};

const ArchiveRoute = ({}: Props) => {
  const { state } = useLocalSearchParams<{ state?: string }>();
  // ?state= previews a sample in development only
  if (__DEV__ && state !== undefined) {
    return <ArchiveStatePreview key={state} state={state} />;
  }
  return <ArchiveScreen />;
};

export default ArchiveRoute;
