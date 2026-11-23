import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import JoinRoom from '@/components/play/JoinRoom';
import ModeChoice from '@/components/play/ModeChoice';
import StepHeading from '@/components/play/StepHeading';
import { STEP_SECTION } from '@/components/play/styles';
import { Button } from '@/components/ui/button';
import type { ModeOption } from '@/types/play';
import type { ProAccess } from '@/types/pro';

type Props = {
  option: ModeOption | null;
  onChange: (option: ModeOption) => void;
  practiceAccess: ProAccess;
  // The solo runs-left or cap line
  allowance: ReactNode;
  // For the join row: any filters, and a code from the params
  filterParams: URLSearchParams | null;
  initialCode: string;
  onNext: () => void;
  isHeadingFocused: boolean;
};

const ModeStep = ({
  option,
  onChange,
  practiceAccess,
  allowance,
  filterParams,
  initialCode,
  onNext,
  isHeadingFocused,
}: Props) => {
  return (
    <>
      <View className={STEP_SECTION}>
        <StepHeading
          title="Choose a mode"
          isFocusedOnMount={isHeadingFocused}
        />
        <ModeChoice
          option={option}
          onChange={onChange}
          practiceAccess={practiceAccess}
        />
        {allowance}
      </View>
      {/* Joining skips filters: the creator's set applies */}
      {option === 'duel' ? (
        <JoinRoom
          // A code arriving later starts the boxes afresh
          key={initialCode}
          filterParams={filterParams}
          initialCode={initialCode}
        />
      ) : null}
      <View className={STEP_SECTION}>
        <Button
          label="Next: filters"
          size="large"
          isDisabled={!option}
          onPress={onNext}
        />
      </View>
    </>
  );
};

export default ModeStep;
