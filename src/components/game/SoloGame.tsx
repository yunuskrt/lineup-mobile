import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import GameCanvas from '@/components/game/GameCanvas';
import QuitDialog from '@/components/game/QuitDialog';
import { useGameBack } from '@/hooks/use-game-back';
import { usePlayerDirectory } from '@/hooks/use-player-directory';
import { useSoloAllowance } from '@/hooks/use-solo-allowance';
import { useSoloRun } from '@/hooks/use-solo-run';
import { sideSchema } from '@/lib/api/schemas/common';
import {
  ARCHIVE_PATH,
  PICKED_MATCH_PARAM,
  withoutPickedMatch,
} from '@/lib/archive';
import { FILTER_PARAMS, withMode, withoutParams } from '@/lib/filters';
import { gameHref, playHref } from '@/lib/game-href';
import { PRACTICE_PARAM } from '@/lib/practice';
import { routeParamsFor, searchParamsOf } from '@/lib/route-params';
import { capLine } from '@/lib/solo-allowance';
import { soloExitStep } from '@/lib/solo-exit';
import { soloCanvasView, soloGateAction, soloQuitCopy } from '@/lib/solo-run';
import type { RouteParams } from '@/types/route-params';

type Props = {};

const SoloGame = ({}: Props) => {
  const routeParams = useLocalSearchParams<RouteParams>();
  // A snapshot, as the web's: the run reads its setup once
  const [params, setParams] = useState(() => searchParamsOf(routeParams));
  const { state, chooseSide, submitGuess, quit, retry, widen, revealMissed } =
    useSoloRun(params);
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

  // Back on /play with this run's choices, under the game, not on it
  function leave() {
    const choices = withMode(withoutPickedMatch(params), 'solo');
    router.dismissTo(playHref(choices, soloExitStep(state)));
  }

  function backToArchive() {
    router.dismissTo(ARCHIVE_PATH);
  }

  // Duels are never capped; only the filters go along, in place of the run
  function playDuel() {
    const leftovers = [PICKED_MATCH_PARAM, PRACTICE_PARAM, FILTER_PARAMS.mode];
    router.replace(gameHref('duel', withoutParams(params, leftovers)));
  }

  // The run restarts on the widened filters, and the params follow
  async function widenAndRestart() {
    const next = await widen();
    if (!next) return;
    setParams(next);
    router.setParams(routeParamsFor(next, routeParams));
  }

  async function handleGuess(text: string) {
    const feedback = await submitGuess(text);
    if (feedback?.clearInput) setGuess('');
  }

  async function confirmQuit() {
    await quit();
    setIsQuitOpen(false);
  }

  function handleGateAction(choiceId?: string) {
    switch (soloGateAction(state)) {
      case 'choose': {
        const side = sideSchema.safeParse(choiceId);
        if (side.success) void chooseSide(side.data);
        return;
      }
      case 'widen':
        void widenAndRestart();
        return;
      case 'leave':
        leave();
        return;
      case 'playDuel':
        playDuel();
        return;
      case 'backToArchive':
        backToArchive();
        return;
      case 'retry':
        if (state.failure?.step === 'quit') void confirmQuit();
        else retry();
        return;
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
        onRevealMissed={revealMissed}
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
