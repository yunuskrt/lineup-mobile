import React from 'react';
import { View } from 'react-native';
import PlaceholderScreen from '@/components/shell/PlaceholderScreen';
import { Skeleton } from '@/components/ui/skeleton';

const ROW_COUNT = 12;

type Props = {};

// Placeholder rows give the list its shape, and something to scroll
const ArchiveScreen = ({}: Props) => {
  return (
    <PlaceholderScreen title="Archive" builtIn="M20: the archive" hasTabBar>
      <View className="gap-3">
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </View>
    </PlaceholderScreen>
  );
};

export default ArchiveScreen;
