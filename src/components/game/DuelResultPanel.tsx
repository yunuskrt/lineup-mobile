import React from 'react';
import { View } from 'react-native';
import Outcome from '@/components/game/duel-result-panel/Outcome';
import Tally from '@/components/game/duel-result-panel/Tally';
import NamedOrder from '@/components/game/NamedOrder';
import ResultActions, {
  type ResultActionsProps,
} from '@/components/game/ResultActions';
import ResultFrame from '@/components/game/ResultFrame';
import { SUMMARY_SECTION } from '@/components/game/styles';
import type { DuelResult } from '@/types/duel';

type Props = ResultActionsProps & {
  result: DuelResult;
  // Your forfeit came from a dropped connection
  isConnectionLost: boolean;
  bottomInset: number;
};

const DuelResultPanel = ({
  result,
  isConnectionLost,
  bottomInset,
  onPlayAgain,
  onChangeFilters,
  onBackToPlay,
  isPrivate,
  hostAccess,
}: Props) => {
  return (
    <ResultFrame
      bottomInset={bottomInset}
      actions={
        <ResultActions
          onPlayAgain={onPlayAgain}
          onChangeFilters={onChangeFilters}
          onBackToPlay={onBackToPlay}
          isPrivate={isPrivate}
          hostAccess={hostAccess}
        />
      }
    >
      <Outcome result={result} isConnectionLost={isConnectionLost} />
      <Tally result={result} />
      <View className={SUMMARY_SECTION}>
        <NamedOrder
          mode="duel"
          found={result.found}
          opponentHandle={result.opponent.handle}
        />
      </View>
    </ResultFrame>
  );
};

export default DuelResultPanel;
