import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from 'expo-router';
import {
  type DemoFrame,
  type DemoTimeline,
  demoFrameAt,
  sameFrame,
} from '@/lib/landing-demo';

function subscribeAppState(onChange: () => void): () => void {
  const subscription = AppState.addEventListener('change', onChange);
  return () => subscription.remove();
}

// Unknown at launch counts as shown; background and inactive don't
function isAppShown(): boolean {
  const state = AppState.currentState;
  return state !== 'background' && state !== 'inactive';
}

export type DemoPlaybackOptions = {
  isEnabled: boolean;
  // Half the frame on screen, from the scroll view that holds it
  isInView: boolean;
  startsPaused?: boolean;
  // Dev snapshots: one moment, never played
  frozenAtMs?: number;
};

export type DemoPlayback = {
  frame: DemoFrame;
  isPaused: boolean;
  togglePause: () => void;
};

// One frame loop; React hears only real changes
export function useDemoPlayback(
  timeline: DemoTimeline,
  {
    isEnabled,
    isInView,
    startsPaused = false,
    frozenAtMs,
  }: DemoPlaybackOptions,
): DemoPlayback {
  const isShown = useSyncExternalStore(subscribeAppState, isAppShown);
  const isFocused = useIsFocused();
  const [isPaused, setIsPaused] = useState(startsPaused);
  const [frame, setFrame] = useState(() =>
    demoFrameAt(timeline, frozenAtMs ?? 0),
  );
  const elapsed = useRef(frozenAtMs ?? 0);
  const isRunning =
    isEnabled &&
    frozenAtMs === undefined &&
    isInView &&
    isShown &&
    isFocused &&
    !isPaused;

  useEffect(() => {
    if (!isRunning) return;
    const startedAt = performance.now();
    const base = elapsed.current;
    let handle = 0;

    const tick = () => {
      elapsed.current = base + (performance.now() - startedAt);
      const next = demoFrameAt(timeline, elapsed.current);
      setFrame((previous) => (sameFrame(previous, next) ? previous : next));
      handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [isRunning, timeline]);

  return {
    frame,
    isPaused,
    togglePause: () => setIsPaused((paused) => !paused),
  };
}
