import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import JoinRoom from '@/components/play/JoinRoom';
import ModeChoice from '@/components/play/ModeChoice';
import StepHeading from '@/components/play/StepHeading';
import { STEP_SECTION } from '@/components/play/styles';
import type { ModeOption } from '@/types/play';
import type { ProAccess } from '@/types/pro';

type Props = {
  option: ModeOption | null;
  onChange: (option: ModeOption) => void;
  // A tap on a card, which moves on to the filters
  onPick: (option: ModeOption) => void;
  practiceAccess: ProAccess;
  // The solo runs-left or cap line
  allowance: ReactNode;
  // For the join row: any filters as a duel, and a code from the params
  joinParams: URLSearchParams | null;
  initialCode: string;
  isHeadingFocused: boolean;
};

// Next: filters sits in the screen's footer
const ModeStep = ({
  option,
  onChange,
  onPick,
  practiceAccess,
  allowance,
  joinParams,
  initialCode,
  isHeadingFocused,
}: Props) => {
  return (
    <View className={STEP_SECTION}>
      <StepHeading title="Choose a mode" isFocusedOnMount={isHeadingFocused} />
      {/* Joining skips filters: the creator's set applies */}
      <JoinRoom
        // A code arriving later starts the boxes afresh
        key={initialCode}
        filterParams={joinParams}
        initialCode={initialCode}
      />
      <ModeChoice
        option={option}
        onChange={onChange}
        onPick={onPick}
        practiceAccess={practiceAccess}
      />
      {allowance}
    </View>
  );
};

export default ModeStep;
