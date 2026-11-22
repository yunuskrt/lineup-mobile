import React from 'react';
import { View } from 'react-native';
import { cn } from '@/lib/utils';

const BLOCK = 'rounded-sm bg-on-scoreboard opacity-15';

type Props = {
  isCompact: boolean;
};

// The header's shape while the match loads, so nothing shifts
const Placeholder = ({ isCompact }: Props) => {
  if (isCompact) return <View className={cn(BLOCK, 'h-4 w-56')} />;

  const team = (
    <View className="flex-1 items-center gap-1">
      <View className={cn(BLOCK, 'h-12 w-12')} />
      <View className={cn(BLOCK, 'h-5 w-12')} />
    </View>
  );
  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        {team}
        <View className={cn(BLOCK, 'h-8 w-20')} />
        {team}
      </View>
      <View className="h-5 items-center justify-center">
        <View className={cn(BLOCK, 'h-3.5 w-40')} />
      </View>
    </View>
  );
};

export default Placeholder;
