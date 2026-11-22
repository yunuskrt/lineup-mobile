import React from 'react';
import CountdownRing, { type RingSize } from '@/components/game/CountdownRing';
import { activeRing } from '@/lib/canvas';
import type { CanvasView } from '@/types/canvas';

type Props = { view: CanvasView; size?: RingSize };

// One clock, owned by whoever's turn it is
const ClockBlock = ({ view, size = 'full' }: Props) => {
  const ring = activeRing(view.clock, view.mode === 'duel' ? view.turn : 'you');

  return (
    <CountdownRing
      round={ring.round}
      mode={ring.mode}
      owner={ring.owner}
      size={size}
    />
  );
};

export default ClockBlock;
