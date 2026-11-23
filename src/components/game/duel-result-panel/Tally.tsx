import React from 'react';
import { View } from 'react-native';
import {
  ACTOR_BAR,
  ACTOR_BG,
} from '@/components/game/duel-result-panel/styles';
import Lives from '@/components/game/Lives';
import { Text } from '@/components/ui/text';
import { foundTally } from '@/lib/duel-result';
import { cn } from '@/lib/utils';
import { SECTION_LABEL, TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';
import type { DuelActor, DuelResult } from '@/types/duel';

// A fixed-size game piece, as the rail's count
const MAX_FONT_SCALE = 1.2;

type Side = {
  actor: DuelActor;
  who: string;
  label: string;
  lives: DuelResult['you']['lives'];
};

type Props = { result: DuelResult };

// Who named how many, and the lives each kept
const Tally = ({ result }: Props) => {
  const tally = foundTally(result.found);
  const { handle } = result.opponent;
  const sides: Side[] = [
    { actor: 'you', who: 'You', label: 'You named', lives: result.you.lives },
    {
      actor: 'opponent',
      who: handle,
      label: `${handle} named`,
      lives: result.opponent.lives,
    },
  ];

  return (
    <View className="flex-row border-b-2 border-line px-4">
      {sides.map(({ actor, who, label, lives }, index) => (
        <View
          key={actor}
          className={cn(
            'min-w-0 flex-1 gap-1.5 py-3',
            index === 0 ? 'border-r-2 border-line pr-3' : 'pl-4',
          )}
        >
          <View
            accessible
            accessibilityLabel={`${label} ${tally[actor]}`}
            className="gap-1.5"
          >
            <View className={cn(ACTOR_BAR, ACTOR_BG[actor])} />
            <Text numberOfLines={1} className={SECTION_LABEL}>
              {label}
            </Text>
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              className={`${TYPE_NUMBER} text-30`}
              // fontVariant: NativeWind can't reach tabular figures
              style={TABULAR_NUMS}
            >
              {tally[actor]}
            </Text>
          </View>
          <Lives lives={lives} owner={actor} whose={who} />
        </View>
      ))}
    </View>
  );
};

export default Tally;
