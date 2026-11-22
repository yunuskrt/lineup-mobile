import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';
import { reconnectSecondsLeft } from '@/lib/duel-status';
import { serverClock } from '@/lib/server-clock';

const RECONNECT_TICK_MS = 250;

type Props = { deadline: number };

// Ticks from the server deadline; decides nothing
const ReconnectChip = ({ deadline }: Props) => {
  const [now, setNow] = useState(() => serverClock.now());

  useEffect(() => {
    const timer = setInterval(
      () => setNow(serverClock.now()),
      RECONNECT_TICK_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <Badge
      variant="sticker"
      tone="warning"
      tilt="none"
      icon={WifiOff}
      isNormalCase
      label={`Reconnecting, ${reconnectSecondsLeft(deadline, now)}s`}
    />
  );
};

export default ReconnectChip;
