import React from 'react';
import { View } from 'react-native';
import { STEP_ACTIONS } from '@/components/play/styles';
import { Button } from '@/components/ui/button';

type Props = {
  // Next waits for the filters to load
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

// Step 2's footer: Back, then Next taking the rest
const FiltersActions = ({ canGoNext, onBack, onNext }: Props) => {
  return (
    <View className={STEP_ACTIONS}>
      <Button label="Back" variant="secondary" size="large" onPress={onBack} />
      <View className="flex-1">
        <Button
          label="Next: start"
          size="large"
          isDisabled={!canGoNext}
          onPress={onNext}
        />
      </View>
    </View>
  );
};

export default FiltersActions;
