import React from 'react';
import { View } from 'react-native';
import MissedReveal from '@/components/game/MissedReveal';
import NamedOrder from '@/components/game/NamedOrder';
import ResultActions, {
  type ResultActionsProps,
} from '@/components/game/ResultActions';
import ResultFrame from '@/components/game/ResultFrame';
import ActionsSkeleton from '@/components/game/run-summary/ActionsSkeleton';
import Outcome from '@/components/game/run-summary/Outcome';
import Stats from '@/components/game/run-summary/Stats';
import SummarySkeleton from '@/components/game/run-summary/SummarySkeleton';
import { SUMMARY_SECTION } from '@/components/game/styles';
import type { SoloEndView } from '@/types/canvas';

type Props = ResultActionsProps & {
  end: SoloEndView;
  bottomInset: number;
  onRevealMissed: () => void;
};

const RunSummary = ({
  end,
  bottomInset,
  onRevealMissed,
  onPlayAgain,
  onChangeFilters,
  onBackToPlay,
  capLine,
  onPlayDuel,
  isPicked,
  isPractice,
}: Props) => {
  const isReady = end.status === 'ready';

  return (
    <ResultFrame
      bottomInset={bottomInset}
      actions={
        isReady ? (
          <ResultActions
            onPlayAgain={onPlayAgain}
            onChangeFilters={onChangeFilters}
            onBackToPlay={onBackToPlay}
            capLine={capLine}
            onPlayDuel={onPlayDuel}
            isPicked={isPicked}
            isPractice={isPractice}
          />
        ) : (
          <ActionsSkeleton />
        )
      }
    >
      {isReady ? (
        <>
          <Outcome summary={end.summary} />
          <Stats summary={end.summary} />
          <View className={SUMMARY_SECTION}>
            <NamedOrder
              mode="solo"
              found={end.summary.found}
              missedCount={end.summary.missedCount}
            />
          </View>
          <MissedReveal
            summary={end.summary}
            isRevealed={end.isMissedRevealed}
            onReveal={onRevealMissed}
          />
        </>
      ) : (
        <SummarySkeleton />
      )}
    </ResultFrame>
  );
};

export default RunSummary;
