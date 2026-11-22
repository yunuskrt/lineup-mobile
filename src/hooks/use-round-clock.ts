import { useEffect, useState } from 'react';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  type SharedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { displaySeconds, remainingMs, sweepFraction } from '@/lib/countdown';
import { serverClock } from '@/lib/server-clock';
import type { RingMode } from '@/types/countdown';
import type { RoundTiming } from '@/types/game';

// Often enough that the number turns with the arc
const SECONDS_TICK_MS = 100;

type RoundClock = { fraction: SharedValue<number>; seconds: number };

// Server time onto the arc and the number; decides nothing
export function useRoundClock(round: RoundTiming, mode: RingMode): RoundClock {
  const { startedAt, endsAt } = round;
  const readSeconds = () =>
    displaySeconds(remainingMs(round, serverClock.now()));
  const [seconds, setSeconds] = useState(readSeconds);
  // A new round or mode re-reads the clock at once
  const roundKey = `${startedAt}:${endsAt}:${mode}`;
  const [syncedKey, setSyncedKey] = useState(roundKey);
  if (roundKey !== syncedKey) {
    setSyncedKey(roundKey);
    setSeconds(readSeconds());
  }
  const fraction = useSharedValue(
    sweepFraction(remainingMs(round, serverClock.now()), round),
  );

  useEffect(() => {
    const timing = { startedAt, endsAt };
    const readRemaining = () => remainingMs(timing, serverClock.now());
    const remaining = readRemaining();

    fraction.set(sweepFraction(remaining, timing));
    // Stopped rings read the clock once
    if (mode !== 'running') return;

    // The sweep is information: Reanimated mustn't skip it
    fraction.set(
      withTiming(0, {
        duration: remaining,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.Never,
      }),
    );
    const timer = setInterval(
      () => setSeconds(displaySeconds(readRemaining())),
      SECONDS_TICK_MS,
    );
    return () => {
      clearInterval(timer);
      cancelAnimation(fraction);
    };
  }, [startedAt, endsAt, mode, fraction]);

  return { fraction, seconds };
}
