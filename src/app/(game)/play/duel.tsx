import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import DuelGame from '@/components/game/DuelGame';
import UpdateRequired from '@/components/game/UpdateRequired';

type Props = {};

// Opened from a link with nothing behind it, Play is the way out
function leavePreview() {
  if (router.canGoBack()) router.back();
  else router.replace('/play');
}

const DuelScreen = ({}: Props) => {
  const { state } = useLocalSearchParams<{ state?: string }>();
  // ?state=refused previews the update screen, with no socket opened
  if (__DEV__ && state === 'refused') {
    return <UpdateRequired onBack={leavePreview} />;
  }
  return <DuelGame />;
};

export default DuelScreen;
