import React from 'react';
import CountdownRing from '@/components/game/CountdownRing';
import { activeRing } from '@/lib/canvas';
import type { CanvasView } from '@/types/canvas';

type Props = { view: CanvasView };

// One clock, owned by whoever's turn it is
const ClockBlock = ({ view }: Props) => {
  const ring = activeRing(view.clock, view.mode === 'duel' ? view.turn : 'you');

  return (
    <CountdownRing round={ring.round} mode={ring.mode} owner={ring.owner} />
  );
};

export default ClockBlock;
