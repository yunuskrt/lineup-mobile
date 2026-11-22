import { useEffect, useState } from 'react';
import {
  droppedLifeActor,
  type LivesByActor,
  shownLivesActor,
} from '@/lib/duel-status';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { DuelActor } from '@/types/duel';

// The key restarts the timer on a repeat drop
type Hold = { actor: DuelActor; key: number };

type ShownActor = {
  shown: DuelActor;
  setPeek: (actor: DuelActor) => void;
};

// Presentation only: which player the duel's lives card shows
export function useShownActor(
  turn: DuelActor | null,
  lives: LivesByActor,
): ShownActor {
  const [previousTurn, setPreviousTurn] = useState(turn);
  const [previousLives, setPreviousLives] = useState(lives);
  const [peek, setPeek] = useState<DuelActor | null>(null);
  const [hold, setHold] = useState<Hold | null>(null);

  if (turn !== previousTurn) {
    setPreviousTurn(turn);
    setPeek(null);
  }

  if (
    lives.you !== previousLives.you ||
    lives.opponent !== previousLives.opponent
  ) {
    setPreviousLives(lives);
    const dropped = droppedLifeActor(previousLives, lives);
    // Stay on them while the shirt empties
    if (dropped) setHold({ actor: dropped, key: (hold?.key ?? 0) + 1 });
  }

  useEffect(() => {
    if (!hold) return;
    const timer = setTimeout(() => setHold(null), MOTION_DURATION_MS.lifeLost);
    return () => clearTimeout(timer);
  }, [hold]);

  return { shown: shownLivesActor(peek, hold?.actor ?? null, turn), setPeek };
}
