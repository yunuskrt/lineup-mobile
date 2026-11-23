import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {};

// The pinned row's two buttons, side by side
const ActionsSkeleton = ({}: Props) => {
  return (
    <View className="flex-row gap-3">
      <Skeleton className="h-14 flex-1 rounded-md" />
      <Skeleton className="h-14 flex-1 rounded-md" />
    </View>
  );
};

export default ActionsSkeleton;
