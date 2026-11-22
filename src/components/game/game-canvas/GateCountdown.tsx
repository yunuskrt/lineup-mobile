import React from 'react';
import { useSecondsLeft } from '@/hooks/use-seconds-left';
import type { CanvasGateCountdown } from '@/types/canvas';

type Props = { countdown: CanvasGateCountdown };

// Plain text: it sits inside the panel's detail line and takes its style
const GateCountdown = ({ countdown }: Props) => {
  const secondsLeft = useSecondsLeft(countdown);

  return <>{countdown.label(secondsLeft)}</>;
};

export default GateCountdown;
