import React from 'react';
import { View } from 'react-native';
import {
  PROFILE_FIGURES,
  RECORD_BAR,
  RECORD_BLOCK,
  RECORD_HEADER,
  STAT_ROW,
  STAT_TILE,
  STATS_BLOCK,
} from '@/components/profile/styles';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const COUNTS = ['won', 'drawn', 'lost'];

type Props = { isGuest: boolean };

// Same classes as the loaded parts, so nothing shifts
const ProfileSkeleton = ({ isGuest }: Props) => {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading your profile"
      className="gap-6"
    >
      <View className="gap-4">
        <View className="flex-row items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <View className="flex-row items-center gap-3 pt-2">
            <Skeleton className="h-7.5 w-40" />
            {isGuest ? <Skeleton className="h-6 w-16" /> : null}
          </View>
        </View>
        {/* The guest strip's height at 390 */}
        {isGuest ? <Skeleton className="h-36 rounded-md" /> : null}
      </View>
      <View className={PROFILE_FIGURES}>
        <ShadowBox radiusClassName="rounded-lg" className={RECORD_BLOCK}>
          <View className={RECORD_HEADER}>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </View>
          <View className="flex-row gap-4">
            {COUNTS.map((count) => (
              <View key={count} className="flex-1 gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-10 w-12" />
              </View>
            ))}
          </View>
          <View className={cn(RECORD_BAR, 'bg-surface-card')} />
        </ShadowBox>
        <View className={STATS_BLOCK}>
          {[0, 1].map((row) => (
            <View
              key={row}
              className={cn(STAT_ROW, row === 0 && 'border-b-2 border-line')}
            >
              {[0, 1].map((tile) => (
                <View
                  key={tile}
                  className={cn(
                    STAT_TILE,
                    tile === 0 && 'border-r-2 border-line',
                  )}
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-12" />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ProfileSkeleton;
