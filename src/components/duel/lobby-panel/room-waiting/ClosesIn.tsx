import React, { useEffect, useState } from 'react';
import { Text } from '@/components/ui/text';
import { roomClosesLabel } from '@/lib/room-code';
import { serverClock } from '@/lib/server-clock';
import { TABULAR_NUMS } from '@/styles/classes';

const ROOM_TICK_MS = 1_000;

type Props = { expiresAt: number };

// Counts to the server's deadline; decides nothing
const ClosesIn = ({ expiresAt }: Props) => {
  const [now, setNow] = useState(() => serverClock.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(serverClock.now()), ROOM_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text
      className="text-14 text-fg-muted"
      // fontVariant: NativeWind can't reach tabular figures
      style={TABULAR_NUMS}
    >
      {roomClosesLabel(expiresAt - now)}
    </Text>
  );
};

export default ClosesIn;
