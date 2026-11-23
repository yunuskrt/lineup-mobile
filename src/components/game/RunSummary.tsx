import React from 'react';
import { ScrollView, View } from 'react-native';
import MissedReveal from '@/components/game/MissedReveal';
import NamedOrder from '@/components/game/NamedOrder';
import ResultActions, {
  type ResultActionsProps,
} from '@/components/game/ResultActions';
import ActionsSkeleton from '@/components/game/run-summary/ActionsSkeleton';
import Outcome from '@/components/game/run-summary/Outcome';
import Stats from '@/components/game/run-summary/Stats';
import { SUMMARY_SECTION } from '@/components/game/run-summary/styles';
import SummarySkeleton from '@/components/game/run-summary/SummarySkeleton';
import type { SoloEndView } from '@/types/canvas';

type Props = ResultActionsProps & {
  end: SoloEndView;
  // Clears the home indicator under the pinned row
  bottomInset: number;
  onRevealMissed: () => void;
};

// The rail once a run ends: it scrolls over a pinned row of actions
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
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="pb-4">
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
      </ScrollView>
      <View
        className="border-t-2 border-line px-4 pt-3"
        // The home indicator's inset is known only at run time
        style={{ paddingBottom: bottomInset }}
      >
        {isReady ? (
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
        )}
      </View>
    </View>
  );
};

export default RunSummary;
