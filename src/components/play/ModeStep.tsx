import React, { type ReactNode } from 'react';
import { View } from 'react-native';
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
  onNext: () => void;
  isHeadingFocused: boolean;
};

const ModeStep = ({
  option,
  onChange,
  practiceAccess,
  allowance,
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
