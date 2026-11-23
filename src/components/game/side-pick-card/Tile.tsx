import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import ClubCrest from '@/components/game/ClubCrest';
import { enterFrom } from '@/components/game/side-pick-card/shared';
import { ChoiceTile } from '@/components/ui/choice-tile';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { cn } from '@/lib/utils';
import { TYPE_CARD_TITLE } from '@/styles/classes';
import type { CanvasSidePick } from '@/types/canvas';
import type { Side } from '@/types/match';

const SLIDE_PT = 24;

// Each tile slides in from its own side
const TILE_ENTER: Record<Side, number> = { home: -SLIDE_PT, away: SLIDE_PT };

type Props = {
  sidePick: CanvasSidePick;
  side: Side;
  onPick: (side: Side) => void;
};

const Tile = ({ sidePick, side, onPick }: Props) => {
  const runs = useMotionPolicy();
  const { match, isChoosing } = sidePick;
  const club = match[side];

  return (
    <Animated.View
      entering={runs('sidePickSlide') ? enterFrom(TILE_ENTER[side]) : undefined}
      className="min-w-0 flex-1"
    >
      <ChoiceTile
        onPress={() => onPick(side)}
        isBusy={isChoosing}
        accessibilityLabel={`Name ${club.name}'s starting XI, ${side} side`}
      >
        <View className="items-center gap-3 py-2">
          {/* The crest sits in a round ink frame, as 12-pick-side-a */}
          <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-line bg-surface-card">
            <ClubCrest club={club} size="card" />
          </View>
          {/* Two lines held, so a short name's tile matches a long one */}
          <Text
            numberOfLines={2}
            className={cn(
              TYPE_CARD_TITLE,
              'h-12 w-full text-center text-16 leading-6',
              isChoosing ? 'text-fg-muted' : 'text-fg',
            )}
          >
            {club.name}
          </Text>
        </View>
      </ChoiceTile>
    </Animated.View>
  );
};

export default Tile;
