import React, { useEffect, useState } from 'react';
import { Text } from '@/components/ui/text';
import { cooldownLabel } from '@/lib/system-states';

const COOLDOWN_TICK_MS = 250;

type Props = { until: number };

// Ticks to the server's retry time; decides nothing
const CooldownLine = ({ until }: Props) => {
  // A rate limit's wait is on this device's clock
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), COOLDOWN_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no"
      className="font-body-medium text-12 text-warning-text"
    >
      {cooldownLabel(until - now)}
    </Text>
  );
};

export default CooldownLine;
