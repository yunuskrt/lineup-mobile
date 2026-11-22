import React from 'react';
import { View } from 'react-native';
import { STILL_STAGE } from '@/components/home/showcase-frame/shared';
import ShowcaseDemo from '@/components/home/showcase-frame/ShowcaseDemo';
import ShowcaseStill from '@/components/home/showcase-frame/ShowcaseStill';
import Stage from '@/components/home/showcase-frame/Stage';
import { Skeleton } from '@/components/ui/skeleton';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import type { Showcase } from '@/types/catalog';
import type { ShowcasePlayback } from '@/types/landing';

type Props = {
  showcase: Showcase | null;
  isLoading: boolean;
  playback?: ShowcasePlayback;
  // Half of it on screen; the loop stops otherwise
  isInView?: boolean;
};

const NO_PLAYBACK: ShowcasePlayback = {};

// The Welcome's demo: one solo turn on a loop, with no clock
const ShowcaseFrame = ({
  showcase,
  isLoading,
  playback = NO_PLAYBACK,
  isInView = true,
}: Props) => {
  const runs = useMotionPolicy();

  if (showcase) {
    return runs('demoLoop') && !playback.isStill ? (
      <ShowcaseDemo
        showcase={showcase}
        playback={playback}
        isInView={isInView}
      />
    ) : (
      <ShowcaseStill showcase={showcase} />
    );
  }
  if (!isLoading) return null;

  return (
    <View className="gap-3">
      <Stage {...STILL_STAGE} match={null} found={[]} />
      <View className="min-h-11 justify-center">
        <Skeleton className="h-5 w-48" />
      </View>
    </View>
  );
};

export default ShowcaseFrame;
