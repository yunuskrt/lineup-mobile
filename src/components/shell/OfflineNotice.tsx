import React, { useEffect } from 'react';
import { View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { announceOfflineOnce, useIsOffline } from '@/hooks/use-is-offline';
import { ROLES } from '@/styles/tokens';

export const OFFLINE_LINE =
  'You’re offline. Lineup needs a connection to play.';

type Props = {
  // Dev previews only: shown without going offline
  isForced?: boolean;
};

// A slim bar under the header; it decides nothing
const OfflineNotice = ({ isForced = false }: Props) => {
  const isReallyOffline = useIsOffline();
  const isOffline = isReallyOffline || isForced;

  useEffect(() => {
    if (isReallyOffline) announceOfflineOnce(OFFLINE_LINE);
  }, [isReallyOffline]);

  if (!isOffline) return null;
  return (
    <View
      accessible
      accessibilityLabel={OFFLINE_LINE}
      className="flex-row items-center gap-2 border-y-2 border-line bg-tag-amber px-4 py-2"
    >
      <WifiOff size={18} strokeWidth={2.5} color={ROLES['on-accent']} />
      <Text className="flex-1 font-body-medium text-14 leading-5 text-on-accent">
        {OFFLINE_LINE}
      </Text>
    </View>
  );
};

export default OfflineNotice;
