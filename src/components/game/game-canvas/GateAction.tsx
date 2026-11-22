import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import type { CanvasGateView } from '@/types/canvas';

type Props = {
  gate: CanvasGateView;
  onGateAction: () => void;
  onGateSecondaryAction: () => void;
};

// Stacked and full width; See Pro is a button, never a link
const GateAction = ({ gate, onGateAction, onGateSecondaryAction }: Props) => {
  return (
    <View className="gap-3">
      <Button label={gate.actionLabel} onPress={onGateAction} />
      {gate.secondaryActionLabel ? (
        <Button
          label={gate.secondaryActionLabel}
          variant="secondary"
          onPress={onGateSecondaryAction}
        />
      ) : null}
      {gate.seePro ? (
        <Button
          label="See Pro"
          variant="secondary"
          onPress={() => router.push('/pro')}
        />
      ) : null}
    </View>
  );
};

export default GateAction;
