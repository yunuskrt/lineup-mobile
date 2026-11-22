import React from 'react';
import { View } from 'react-native';
import Caption from '@/components/home/showcase-frame/Caption';
import { STILL_STAGE } from '@/components/home/showcase-frame/shared';
import Stage from '@/components/home/showcase-frame/Stage';
import { showcaseFound } from '@/lib/landing';
import type { Showcase } from '@/types/catalog';

type Props = { showcase: Showcase };

// Reduced motion: the demo's reveals filled, nothing moves
const ShowcaseStill = ({ showcase }: Props) => {
  return (
    <View className="gap-3">
      <Stage
        {...STILL_STAGE}
        match={showcase.match}
        found={showcaseFound(showcase)}
      />
      <Caption showcase={showcase} />
    </View>
  );
};

export default ShowcaseStill;
