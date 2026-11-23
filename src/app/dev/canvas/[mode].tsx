import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameCanvas from '@/components/game/GameCanvas';
import NotFoundView from '@/components/shell/NotFoundView';
import { Button } from '@/components/ui/button';
import {
  AFTER_GATE_STATE,
  type CanvasFrame,
  type CanvasSnapshot,
  resolveCanvasState,
  SNAPSHOT_EVENT_DELAY_MS,
} from '@/lib/dev/canvas-states';
import { SAMPLE_SUGGESTION_INDEX } from '@/lib/dev/samples';
import { serverClock } from '@/lib/server-clock';
import type { CanvasMode, CanvasView } from '@/types/canvas';

// Read once as a state opens, in server time, as the ring reads it
function buildSnapshot(mode: CanvasMode, name?: string): CanvasSnapshot {
  return resolveCanvasState(mode, name).build(serverClock.now());
}

// The full scoreboard's 112pt, plus a gap
const DEV_BUTTON_TOP = 120;

// Dev only: the server's handover, so the keyboard's drop can be tried
function passTurn(view: CanvasView): CanvasView {
  if (view.mode !== 'duel') return view;
  const turn = view.turn === 'you' ? 'opponent' : 'you';
  return { ...view, turn, input: turn === 'you' ? 'live' : 'locked' };
}

type CanvasPreviewProps = { mode: CanvasMode; state?: string };

// The web's CanvasStatePreview: a snapshot, then its one event
const CanvasPreview = ({ mode, state }: CanvasPreviewProps) => {
  const [snapshot, setSnapshot] = useState(() => buildSnapshot(mode, state));
  const [frame, setFrame] = useState<CanvasFrame>(snapshot.frame);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const { next } = snapshot;
    if (!next) return;
    const timer = setTimeout(() => setFrame(next), SNAPSHOT_EVENT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [snapshot]);

  // Snapshots reveal locally; there's no run to tell
  function revealMissed() {
    setFrame((current) => {
      const { view } = current;
      if (view.mode !== 'solo' || view.end?.status !== 'ready') return current;
      return {
        ...current,
        view: { ...view, end: { ...view.end, isMissedRevealed: true } },
      };
    });
  }

  function openGate() {
    const started = buildSnapshot(mode, AFTER_GATE_STATE);
    setSnapshot(started);
    setFrame(started.frame);
  }

  return (
    <View className="flex-1">
      <GameCanvas
        view={frame.view}
        guess={frame.guess}
        directory={SAMPLE_SUGGESTION_INDEX}
        onGuessChange={(guess) =>
          setFrame((current) => ({ ...current, guess }))
        }
        // Snapshots have no server to send a guess to
        onGuessSubmit={() => {}}
        onGateAction={openGate}
        onQuit={() => router.back()}
        onBackToPlay={() => router.back()}
        onRevealMissed={revealMissed}
      />
      {/* Clear of Expo's dev bubble: under the full scoreboard, on the turf */}
      {mode === 'duel' ? (
        <View
          className="absolute right-2"
          // The status bar's height is known only at run time
          style={{ top: insets.top + DEV_BUTTON_TOP }}
        >
          <Button
            icon={ArrowLeftRight}
            size="icon"
            accessibilityLabel="Pass the turn"
            onPress={() =>
              setFrame((current) => ({
                ...current,
                view: passTurn(current.view),
              }))
            }
          />
        </View>
      ) : null}
    </View>
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
