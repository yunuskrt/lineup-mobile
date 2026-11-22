import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import type { AuthMode } from '@/types/auth';

type Props = {
  mode: AuthMode;
};

// The form's exact shape, so nothing jumps when the session lands
const AuthSkeleton = ({ mode }: Props) => {
  const fieldCount = mode === 'sign-up' ? 3 : 2;
  return (
    <View className="gap-5">
      <Skeleton className="h-14 w-full rounded-full" />
      {Array.from({ length: fieldCount }, (_, index) => (
        <View key={index} className="gap-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-12 w-full" />
        </View>
      ))}
      <Skeleton className="h-14 w-full" />
    </View>
  );
};

export default AuthSkeleton;
