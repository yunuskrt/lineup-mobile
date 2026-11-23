import React from 'react';
import { View } from 'react-native';
import Lives from '@/components/game/Lives';
import { OUTCOME_BOX } from '@/components/game/styles';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useMountFocus } from '@/hooks/use-mount-focus';
import { SQUAD_SIZE } from '@/lib/api/schemas/common';
import { pluralOf } from '@/lib/plural';
import { summaryTitle } from '@/lib/summary';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS, TYPE_NUMBER, TYPE_TITLE } from '@/styles/classes';
import type { SoloSummary } from '@/types/solo';

const MAX_FONT_SCALE = 1.2;

type Props = { summary: SoloSummary };

const Outcome = ({ summary }: Props) => {
  // Mounts once the summary is ready; the title is read first
  const titleRef = useMountFocus();
  const isPerfect = summary.endReason === 'perfect_clear';
  const lives = summary.livesRemaining;
  const livesLeft = pluralOf(lives, 'life left', 'lives left');
  // Text on the green fill is on-accent, as on every pastel
  const ink = isPerfect ? 'text-on-accent' : 'text-fg';

  return (
    // A perfect clear takes the block in green, edge to edge
    <View className={cn(OUTCOME_BOX, isPerfect && 'bg-found')}>
      <View className="min-w-0 flex-1 gap-1">
        <View ref={titleRef} accessible accessibilityRole="header">
          <Text className={cn(TYPE_TITLE, ink)}>
            {summaryTitle(summary.endReason)}
          </Text>
        </View>
        <Text className={cn('text-14', isPerfect ? ink : 'text-fg-muted')}>
          You named {summary.found.length} of {SQUAD_SIZE}.
        </Text>
      </View>
      {/* No lives in practice: the tag stands in */}
      {summary.practice ? (
        <Badge
          label="Practice"
          variant="sticker"
          tone={isPerfect ? 'neutral' : 'mint'}
        />
      ) : isPerfect ? (
        <View
          accessible
          accessibilityLabel={`${lives} ${livesLeft}`}
          className="flex-shrink-0 items-end"
        >
          <Text
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            className={`${TYPE_NUMBER} text-48 leading-12 text-on-accent`}
            // fontVariant: NativeWind can't reach tabular figures
            style={TABULAR_NUMS}
          >
            {lives}
          </Text>
          <Text className="font-body-medium text-12 text-on-accent">
            {livesLeft}
          </Text>
        </View>
      ) : (
        <Lives lives={lives} />
      )}
    </View>
  );
};

export default Outcome;
