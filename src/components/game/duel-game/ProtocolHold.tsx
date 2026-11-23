import React from 'react';
import { View } from 'react-native';
import { Hammer, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { laterPartLine } from '@/lib/canvas-parts';

type Props = { onBack: () => void };

// Until M21's update screen: no duel to show, only a way back
const ProtocolHold = ({ onBack }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 justify-center gap-6 bg-surface px-4"
      // The safe areas are known only at run time
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Empty
        icon={RefreshCw}
        title="Update Lineup to keep playing"
        message="This version is out of date, so the duel server turned it away."
      />
      <StateNotice
        tone="info"
        icon={Hammer}
        message={laterPartLine({ phase: 'M21', name: 'update screen' })}
        isCompact
      />
      <Button label="Back to play" variant="secondary" onPress={onBack} />
    </View>
  );
};

export default ProtocolHold;
