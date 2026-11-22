import React from 'react';
import { Text } from '@/components/ui/text';
import { useSecondsLeft } from '@/hooks/use-seconds-left';
import { TABULAR_NUMS, TYPE_NUMBER } from '@/styles/classes';
import type { CanvasGateCountdown } from '@/types/canvas';

// A fixed piece, as the clock: larger text would overflow the panel
const MAX_FONT_SCALE = 1;

type Props = { countdown: CanvasGateCountdown };

// The same deadline, big; the sentence says it too
const GateSeconds = ({ countdown }: Props) => {
  const secondsLeft = useSecondsLeft(countdown);

  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no"
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      className={`text-center text-48 ${TYPE_NUMBER}`}
      // fontVariant: NativeWind can't reach tabular figures
      style={TABULAR_NUMS}
    >
      {secondsLeft}s
    </Text>
  );
};

export default GateSeconds;
