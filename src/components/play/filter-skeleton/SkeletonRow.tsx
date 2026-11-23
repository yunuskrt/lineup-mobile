import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { FILTER_ROW } from '@/components/play/styles';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  // The label's width, e.g. w-24
  label: string;
  children: ReactNode;
};

const SkeletonRow = ({ label, children }: Props) => {
  return (
    <View className={FILTER_ROW}>
      <Skeleton className={`h-5 ${label}`} />
      {children}
    </View>
  );
};

export default SkeletonRow;
