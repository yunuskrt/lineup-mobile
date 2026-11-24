import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import GameCanvas from '@/components/game/GameCanvas';
import QuitDialog, { DUEL_FORFEIT_COPY } from '@/components/game/QuitDialog';
import UpdateRequired from '@/components/game/UpdateRequired';
import { useDuel } from '@/hooks/use-duel';
import { useGameBack } from '@/hooks/use-game-back';
import { useGameOpen } from '@/hooks/use-game-open';
import { usePlayerDirectory } from '@/hooks/use-player-directory';
import { useProAccess } from '@/hooks/use-pro';
import {
  canConfirmForfeit,
  duelCanvasView,
  duelGateAction,
  keepsJoinCode,
} from '@/lib/duel-session';
import { withMode, withoutParams } from '@/lib/filters';
import { gameHref, playHref } from '@/lib/game-href';
import { ROOM_PARAM } from '@/lib/room-code';
import { routeParamsFor, searchParamsOf } from '@/lib/route-params';
import type { LobbyAction } from '@/types/duel-lobby';
import type { PlayStep } from '@/lib/play-steps';
import type { PlayMode } from '@/types/play';
import type { RouteParams } from '@/types/route-params';

// The Profile tab, where a result decided away is kept
const PROFILE_PATH = '/profile';

type Props = {};

// One route for the duel: the lobby, the match and the result
const DuelGame = ({}: Props) => {
  const routeParams = useLocalSearchParams<RouteParams>();
  // A snapshot, as the web's: the duel reads its setup once
  const [params, setParams] = useState(() => searchParamsOf(routeParams));
  const {
    state,
    you,
    lockFilters,
    submitGuess,
    forfeit,
    searchAgain,
    playAgain,
    newRoom,
    leave,
    retry,
    widen,
  } = useDuel(params);
  const directory = usePlayerDirectory(state.session?.sessionId ?? null);
  // Whether New room is offered after a room game
  const hostAccess = useProAccess();
  const [guess, setGuess] = useState('');
  const [clearKey, setClearKey] = useState(state.clearKey);
  const [isForfeitOpen, setIsForfeitOpen] = useState(false);
  // Mid-match only; the lobby has nothing to forfeit
  const isForfeitAllowed = canConfirmForfeit(state);

  // A verdict that clears the input, seen once
  if (state.clearKey !== clearKey) {
    setClearKey(state.clearKey);
    setGuess('');
  }

  // A new room or a wider set: the route's params follow
  function follow(next: URLSearchParams | null) {
    if (!next) return;
    setParams(next);
    router.setParams(routeParamsFor(next, routeParams));
  }

  // The room stays behind, unless a join was refused
  function leavingParams(mode: PlayMode): URLSearchParams {
    const leftovers = keepsJoinCode(state) ? [] : [ROOM_PARAM];
    return withMode(withoutParams(params, leftovers), mode);
  }

  // Leaves the duel first, then /play under the game
  async function backTo(step: PlayStep) {
    await leave();
    router.dismissTo(playHref(leavingParams('duel'), step));
  }

  // A refused code goes back to its box on step 1
  function backToPlay() {
    void backTo(keepsJoinCode(state) ? 'mode' : 'start');
  }

  async function playSolo() {
    await leave();
    router.replace(gameHref('solo', leavingParams('solo')));
  }

  function handleLobbyAction(action: LobbyAction) {
    switch (action) {
      case 'cancel':
        backToPlay();
        return;
      case 'lock':
        void lockFilters();
        return;
      case 'solo':
        void playSolo();
        return;
      case 'searchAgain':
        searchAgain();
        return;
      case 'newRoom':
        setGuess('');
        follow(newRoom());
        return;
    }
  }

  function handleGateAction() {
    switch (duelGateAction(state)) {
      case 'widen':
        // Play again and Change filters use the wider set
        follow(widen());
        return;
      case 'leave':
        backToPlay();
        return;
      case 'retry':
        follow(retry());
        return;
      case 'playAgain':
        handlePlayAgain();
        return;
    }
  }

  // A result away is on the profile
  async function handleGateSecondaryAction() {
    if (state.phase !== 'endedAway') {
      backToPlay();
      return;
    }
    await leave();
    router.dismissTo(PROFILE_PATH);
  }

  function handleQuit() {
    if (isForfeitAllowed) setIsForfeitOpen(true);
    else backToPlay();
  }

  async function confirmForfeit() {
    await forfeit();
    setIsForfeitOpen(false);
  }

  function handlePlayAgain() {
    setGuess('');
    follow(playAgain());
  }

  useGameOpen();
  useGameBack(handleQuit);

  if (state.phase === 'refused') {
    return <UpdateRequired onBack={backToPlay} />;
  }

  return (
    <>
      <GameCanvas
        view={{ ...duelCanvasView(state, you), hostAccess }}
        guess={guess}
        directory={directory}
        onGuessChange={setGuess}
        onGuessSubmit={(text) => void submitGuess(text)}
        onGateAction={handleGateAction}
        onGateSecondaryAction={() => void handleGateSecondaryAction()}
        onQuit={handleQuit}
        onPlayAgain={handlePlayAgain}
        onChangeFilters={() => void backTo('filters')}
        onBackToPlay={backToPlay}
        onLobbyAction={handleLobbyAction}
      />
      <QuitDialog
        // Closes in the render the duel ends in
        isOpen={isForfeitOpen && isForfeitAllowed}
        isQuitting={state.isForfeiting}
        copy={DUEL_FORFEIT_COPY}
        onDismiss={() => setIsForfeitOpen(false)}
        onConfirm={() => void confirmForfeit()}
      />
    </>
  );
};

export default DuelGame;
