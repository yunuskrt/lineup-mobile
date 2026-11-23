import React from 'react';
import { View } from 'react-native';
import { ACTOR_BG } from '@/components/game/duel-result-panel/styles';
import { OUTCOME_BOX } from '@/components/game/styles';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useMountFocus } from '@/hooks/use-mount-focus';
import { duelResultDetail, duelResultTitle } from '@/lib/duel-result';
import { cn } from '@/lib/utils';
import { TYPE_TITLE } from '@/styles/classes';
import type { DuelResult } from '@/types/duel';
import type { DuelOutcome } from '@/types/game';

// A win takes the block in your colour, edge to edge
const OUTCOME_TONES: Record<DuelOutcome, string> = {
  win: 'bg-you',
  forfeit_win: 'bg-you',
  loss: 'bg-surface-card',
  draw: 'bg-surface-card',
};

const TOP_BAND = 'absolute inset-x-0 top-0 h-1.5 flex-row';

type Props = {
  result: DuelResult;
  isConnectionLost: boolean;
};

const Outcome = ({ result, isConnectionLost }: Props) => {
  // The result arrives whole; the title is read first
  const titleRef = useMountFocus();
  const isWin = result.outcome === 'win' || result.outcome === 'forfeit_win';
  const copy = { isConnectionLost };

  return (
    <View className={cn(OUTCOME_BOX, OUTCOME_TONES[result.outcome])}>
      {/* A draw carries both colours, neither leading */}
      {result.outcome === 'draw' ? (
        <View className={TOP_BAND}>
          <View className={cn('flex-1', ACTOR_BG.you)} />
          <View className={cn('flex-1', ACTOR_BG.opponent)} />
        </View>
      ) : null}
      {result.outcome === 'loss' ? (
        <View className={cn(TOP_BAND, 'bg-danger')} />
      ) : null}
      <View className="min-w-0 flex-1 gap-1">
        <View ref={titleRef} accessible accessibilityRole="header">
          <Text
            className={cn(TYPE_TITLE, isWin ? 'text-on-accent' : 'text-fg')}
          >
            {duelResultTitle(result, copy)}
          </Text>
        </View>
        <Text
          className={cn('text-14', isWin ? 'text-on-accent' : 'text-fg-muted')}
        >
          {duelResultDetail(result, copy)}
        </Text>
      </View>
      {result.isForfeit ? (
        <Badge label="Forfeit" variant="sticker" tone="neutral" />
      ) : null}
    </View>
  );
};

export default Outcome;
