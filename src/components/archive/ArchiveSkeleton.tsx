import React from 'react';
import { View } from 'react-native';
import {
  ARCHIVE_ACTIONS,
  ARCHIVE_LIST,
  ARCHIVE_META,
  ARCHIVE_ROW,
  ARCHIVE_TEAMS,
} from '@/components/archive/styles';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const ROWS = [0, 1, 2, 3, 4, 5];

type Props = { isCompact: boolean };

// The rows' own frame: nothing shifts on arrival
const ArchiveSkeleton = ({ isCompact }: Props) => {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading matches"
      className={ARCHIVE_LIST}
    >
      {ROWS.map((row) => (
        <View
          key={row}
          className={cn(
            ARCHIVE_ROW,
            row < ROWS.length - 1 && 'border-b-2 border-rule',
          )}
        >
          <View className={ARCHIVE_TEAMS}>
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-5 flex-1" />
          </View>
          <View className={ARCHIVE_META}>
            <Skeleton className="h-4 max-w-64 flex-1" />
          </View>
          <View className={ARCHIVE_ACTIONS}>
            <Skeleton className="h-11 w-16 rounded-md" />
            <Skeleton
              className={cn('h-11 rounded-md', isCompact ? 'w-11' : 'w-24')}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default ArchiveSkeleton;
