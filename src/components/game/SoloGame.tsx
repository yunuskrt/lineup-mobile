import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import GameCanvas from '@/components/game/GameCanvas';
import QuitDialog from '@/components/game/QuitDialog';
import { useGameBack } from '@/hooks/use-game-back';
import { usePlayerDirectory } from '@/hooks/use-player-directory';
import { useSoloAllowance } from '@/hooks/use-solo-allowance';
import { useSoloRun } from '@/hooks/use-solo-run';
import { sideSchema } from '@/lib/api/schemas/common';
import { withoutPickedMatch } from '@/lib/archive';
import { withMode } from '@/lib/filters';
import { playHref } from '@/lib/game-href';
import { searchParamsOf } from '@/lib/route-params';
import { capLine } from '@/lib/solo-allowance';
import { soloCanvasView, soloGateAction, soloQuitCopy } from '@/lib/solo-run';
import type { RouteParams } from '@/types/route-params';

type Props = {};

const SoloGame = ({}: Props) => {
  const routeParams = useLocalSearchParams<RouteParams>();
  // A snapshot, as the web's: the run reads its setup once
  const [params] = useState(() => searchParamsOf(routeParams));
  const { state, chooseSide, submitGuess, quit, retry } = useSoloRun(params);
  const directory = usePlayerDirectory(state.offer?.sessionId ?? null);
  const allowance = useSoloAllowance();
  const cap = capLine(allowance.data ?? null);
  const [guess, setGuess] = useState('');
  const [isQuitOpen, setIsQuitOpen] = useState(false);
  // Mid-play only; a gate or the end has its own exit
  const canConfirmQuit =
    state.phase === 'playing' &&
    state.session?.status === 'active' &&
    state.summary === null;

  // Step 3 of /play with this run's choices, under the game, not on it
  function leave() {
    const choices = withMode(withoutPickedMatch(params), 'solo');
    router.dismissTo(playHref(choices, 'start'));
  }

  async function handleGuess(text: string) {
    const feedback = await submitGuess(text);
    if (feedback?.clearInput) setGuess('');
  }

  async function confirmQuit() {
    await quit();
    setIsQuitOpen(false);
  }

  // The other actions arrive in M14b; until then they leave
  function handleGateAction(choiceId?: string) {
    switch (soloGateAction(state)) {
      case 'choose': {
        const side = sideSchema.safeParse(choiceId);
        if (side.success) void chooseSide(side.data);
        return;
      }
      case 'retry':
        if (state.failure?.step === 'quit') void confirmQuit();
        else retry();
        return;
      default:
        leave();
    }
  }

  function handleQuit() {
    if (canConfirmQuit) setIsQuitOpen(true);
    else leave();
  }

  useGameBack(handleQuit);

  return (
    <>
      <GameCanvas
        view={soloCanvasView(state, cap)}
        guess={guess}
        directory={directory}
        onGuessChange={setGuess}
        onGuessSubmit={(text) => void handleGuess(text)}
        onGateAction={handleGateAction}
        onGateSecondaryAction={leave}
        onQuit={handleQuit}
        onBackToPlay={leave}
      />
      <QuitDialog
        // Closes in the render the run ends in
        isOpen={isQuitOpen && canConfirmQuit}
        isQuitting={state.isQuitting}
        copy={soloQuitCopy(state)}
        onDismiss={() => setIsQuitOpen(false)}
        onConfirm={() => void confirmQuit()}
      />
    </>
  );
};

export default SoloGame;
