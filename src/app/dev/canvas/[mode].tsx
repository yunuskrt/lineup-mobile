import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import GameCanvas from '@/components/game/GameCanvas';
import NotFoundView from '@/components/shell/NotFoundView';
import {
  AFTER_GATE_STATE,
  type CanvasFrame,
  type CanvasSnapshot,
  resolveCanvasState,
  SNAPSHOT_EVENT_DELAY_MS,
} from '@/lib/dev/canvas-states';
import { SAMPLE_SUGGESTION_INDEX } from '@/lib/dev/samples';
import type { CanvasMode } from '@/types/canvas';

// Outside the component: the clock is read once, when a state opens
function buildSnapshot(mode: CanvasMode, name?: string): CanvasSnapshot {
  return resolveCanvasState(mode, name).build(Date.now());
}

type CanvasPreviewProps = { mode: CanvasMode; state?: string };

// The web's CanvasStatePreview: a snapshot, then its one event
const CanvasPreview = ({ mode, state }: CanvasPreviewProps) => {
  const [snapshot, setSnapshot] = useState(() => buildSnapshot(mode, state));
  const [frame, setFrame] = useState<CanvasFrame>(snapshot.frame);

  useEffect(() => {
    const { next } = snapshot;
    if (!next) return;
    const timer = setTimeout(() => setFrame(next), SNAPSHOT_EVENT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [snapshot]);

  function openGate() {
    const started = buildSnapshot(mode, AFTER_GATE_STATE);
    setSnapshot(started);
    setFrame(started.frame);
  }

  return (
    <GameCanvas
      view={frame.view}
      guess={frame.guess}
      directory={SAMPLE_SUGGESTION_INDEX}
      onGuessChange={(guess) => setFrame((current) => ({ ...current, guess }))}
      // Snapshots have no server to send a guess to
      onGuessSubmit={() => {}}
      onGateAction={openGate}
      onQuit={() => router.back()}
    />
  );
};

type Props = {};

const CanvasStateScreen = ({}: Props) => {
  const { mode, state } = useLocalSearchParams<{
    mode: string;
    state?: string;
  }>();
  if (mode !== 'solo' && mode !== 'duel') return <NotFoundView />;

  return <CanvasPreview key={`${mode}:${state}`} mode={mode} state={state} />;
};

export default CanvasStateScreen;
