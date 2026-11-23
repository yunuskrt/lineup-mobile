import React from 'react';
import { View } from 'react-native';
import { Hammer } from 'lucide-react-native';
import StepHeading from '@/components/play/StepHeading';
import { STEP_ACTIONS, STEP_SECTION } from '@/components/play/styles';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';

type Props = {
  title: string;
  // Which spec builds it, e.g. "M13c: the start"
  builtIn: string;
  onBack: () => void;
  isHeadingFocused: boolean;
};

// Step 3 until M13c: heading, notice, Back
const LaterStep = ({ title, builtIn, onBack, isHeadingFocused }: Props) => {
  return (
    <>
      <View className={STEP_SECTION}>
        <StepHeading title={title} isFocusedOnMount={isHeadingFocused} />
        <StateNotice
          tone="info"
          icon={Hammer}
          message={`Built in ${builtIn}.`}
        />
      </View>
      <View className={STEP_SECTION}>
        <View className={STEP_ACTIONS}>
          <Button
            label="Back"
            variant="secondary"
            size="large"
            onPress={onBack}
          />
        </View>
      </View>
    </>
  );
};

export default LaterStep;
