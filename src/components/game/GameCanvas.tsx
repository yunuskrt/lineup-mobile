import React, {
  type ReactNode,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Keyboard,
  type LayoutChangeEvent,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';
import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CircleAlert, WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LobbyPanel from '@/components/duel/LobbyPanel';
import CanvasGate from '@/components/game/CanvasGate';
import DuelResultPanel from '@/components/game/DuelResultPanel';
import FoundCount from '@/components/game/FoundCount';
import ActiveRail from '@/components/game/game-canvas/ActiveRail';
import GateAction from '@/components/game/game-canvas/GateAction';
import GateCountdown from '@/components/game/game-canvas/GateCountdown';
import GateSeconds from '@/components/game/game-canvas/GateSeconds';
import LifeLostFlash from '@/components/game/LifeLostFlash';
import MatchHeader from '@/components/game/MatchHeader';
import RunSummary from '@/components/game/RunSummary';
import SidePickCard from '@/components/game/SidePickCard';
import SoundToggle from '@/components/game/SoundToggle';
import SquadGrid from '@/components/pitch/SquadGrid';
import OfflineNotice from '@/components/shell/OfflineNotice';
import QuitChip from '@/components/shell/QuitChip';
import { Alert } from '@/components/ui/alert';
import { IconTile } from '@/components/ui/icon-tile';
import { useGameSounds } from '@/hooks/use-game-sounds';
import { useKeyboardFrame } from '@/hooks/use-keyboard-frame';
import { gateSize } from '@/lib/canvas-parts';
import { LOADING_FORMATION } from '@/lib/formation';
import { bandLift } from '@/lib/keyboard-band';
import { suggest, type SuggestionIndex } from '@/lib/suggestions';
import { missedOnPitch } from '@/lib/summary';
import { cn } from '@/lib/utils';
import { isShortScreen } from '@/lib/welcome';
import type { CanvasGateView, CanvasView } from '@/types/canvas';
import type { LobbyAction } from '@/types/duel-lobby';

// The rail's own gap above the home indicator
const RAIL_BOTTOM_GAP = 12;

// The turf's share of the window once a game ends, as the design sketch
const SUMMARY_TURF_SHARE = 0.4;
const SHORT_SUMMARY_TURF_SHARE = 0.3;

type NoticeParts = { icon?: ReactNode; detail?: ReactNode; body?: ReactNode };

// A gate's notice: an icon, or the detail as an Alert
function noticeParts(gate: CanvasGateView | null): NoticeParts {
  if (gate?.notice === 'refused') {
    return {
      body: gate.detail ? (
        <Alert icon={CircleAlert}>{gate.detail}</Alert>
      ) : undefined,
    };
  }
  const detail = gate?.countdown ? (
    <GateCountdown countdown={gate.countdown} />
  ) : (
    gate?.detail
  );
  if (gate?.notice !== 'connection') return { detail };
  return {
    icon: <IconTile icon={WifiOff} size="lg" />,
    detail,
    body: gate.countdown ? (
      <GateSeconds countdown={gate.countdown} />
    ) : undefined,
  };
}

type Props = {
  view: CanvasView;
  guess: string;
  // Null while loading or after a failed fetch
  directory?: SuggestionIndex | null;
  onGuessChange: (value: string) => void;
  onGuessSubmit: (guess: string) => void;
  onGateAction: (choiceId?: string) => void;
  onGateSecondaryAction?: () => void;
  // Without it, quitting goes back to /play
  onQuit?: () => void;
  onPlayAgain?: () => void;
  onChangeFilters?: () => void;
  // The summary's Back to play; Change filters when unset
  onBackToPlay?: () => void;
  onPlayDuel?: () => void;
  onRevealMissed?: () => void;
  onLobbyAction?: (action: LobbyAction) => void;
};

// One board: scoreboard, turf and rail, edge to edge
const GameCanvas = ({
  view,
  guess,
  directory = null,
  onGuessChange,
  onGuessSubmit,
  onGateAction,
  onGateSecondaryAction = () => {},
  onQuit,
  onPlayAgain = () => {},
  onChangeFilters = () => {},
  onBackToPlay,
  onPlayDuel = () => {},
  onRevealMissed = () => {},
  onLobbyAction = () => {},
}: Props) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  useGameSounds(view);
  const windowHeight = useWindowDimensions().height;
  const isShort = isShortScreen(windowHeight);
  const keyboard = useKeyboardFrame();
  // The band's height with no list open; the list floats over the turf
  const [bandHeight, setBandHeight] = useState(0);
  const [isListOpen, setIsListOpen] = useState(false);
  const soloEnd = view.mode === 'solo' ? view.end : null;
  const result = view.mode === 'duel' ? view.end : null;
  const summary = soloEnd?.status === 'ready' ? soloEnd.summary : null;
  const isPerfectClear = summary?.endReason === 'perfect_clear';
  // The result's own actions take over from quit
  const hasQuit = summary === null && result === null;
  const found = result?.found ?? view.found;
  const hasEnded = soloEnd !== null || result !== null;
  // Only the live rail rides the keys; a result has no input
  const isBand = keyboard.isShown && !hasEnded;
  const isCompact = isShort || isBand;
  // In the flow until measured, then over the turf with its room held
  const isFloating = isBand && bandHeight > 0;
  // A result has no input; Android may raise the keys on return
  useEffect(() => {
    if (hasEnded) Keyboard.dismiss();
  }, [hasEnded]);
  const notice = noticeParts(view.gate);
  const query = useDeferredValue(guess);
  // Keyed by value: views are rebuilt every render
  const namedList = view.found.map((player) => player.directoryKey).join(' ');
  const namedKeys = useMemo(
    () => new Set(namedList.split(' ').filter(Boolean)),
    [namedList],
  );
  const suggestions = useMemo(
    () => (directory ? suggest(directory, query, namedKeys) : []),
    [directory, query, namedKeys],
  );

  function measureBand(event: LayoutChangeEvent) {
    if (!isListOpen) setBandHeight(event.nativeEvent.layout.height);
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Light over the ink only while the board is the screen in view */}
      {isFocused ? <StatusBar style="light" /> : null}
      {/* Over the scrim, so a gate never traps the player */}
      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 top-0 z-10"
        // The status bar's height is known only at run time
        style={{ paddingTop: insets.top }}
      >
        {/* Quit left and sound right, so the score stays centred */}
        <View
          pointerEvents="box-none"
          className={cn(
            'flex-row items-center justify-between px-0.5',
            isCompact ? 'h-11' : 'h-28',
          )}
        >
          {hasQuit ? <QuitChip onQuit={onQuit} isOnScoreboard /> : <View />}
          <SoundToggle isOnScoreboard />
        </View>
      </View>
      <CanvasGate
        isOpen={view.gate !== null}
        icon={notice.icon}
        title={view.gate?.title ?? ''}
        detail={notice.detail}
        size={gateSize(view)}
        body={
          view.mode === 'duel' && view.lobby ? (
            <LobbyPanel
              lobby={view.lobby}
              you={view.you}
              opponent={view.opponent}
              onAction={onLobbyAction}
            />
          ) : view.gate?.sidePick ? (
            <SidePickCard
              sidePick={view.gate.sidePick}
              onPick={(side) => onGateAction(side)}
            />
          ) : (
            notice.body
          )
        }
        action={
          view.gate?.actionLabel ? (
            <GateAction
              gate={view.gate}
              onGateAction={() => onGateAction()}
              onGateSecondaryAction={onGateSecondaryAction}
            />
          ) : undefined
        }
      >
        <View
          className="flex-1"
          // Edge to edge the window never resizes: the band sits on the keys
          style={{
            paddingBottom: isBand
              ? bandLift(Platform.OS, keyboard.height, insets.bottom)
              : 0,
          }}
        >
          <View
            className="border-b-2 border-line bg-scoreboard"
            // The scoreboard runs up under the status bar
            style={{ paddingTop: insets.top }}
          >
            <MatchHeader match={view.match} isCompact={isCompact} hasControls />
          </View>
          {/* Only while loading: a paused start would otherwise say nothing */}
          {view.match === null ? <OfflineNotice /> : null}
          <View className="flex-1">
            <View
              className={cn('bg-turf p-2', !hasEnded && 'flex-1')}
              // A share of the window, known only at run time
              style={
                hasEnded
                  ? {
                      height: Math.round(
                        windowHeight *
                          (isShort
                            ? SHORT_SUMMARY_TURF_SHARE
                            : SUMMARY_TURF_SHARE),
                      ),
                    }
                  : undefined
              }
            >
              {view.match ? <FoundCount found={found} /> : null}
              <SquadGrid
                formation={view.match?.formation ?? LOADING_FORMATION}
                revealed={found}
                missed={missedOnPitch(soloEnd)}
                pulse={view.pulse}
                isLoading={view.match === null}
              />
              {isPerfectClear ? (
                <View
                  pointerEvents="none"
                  className="absolute inset-0 border-4 border-found"
                />
              ) : null}
            </View>
            {soloEnd ? (
              <View className="flex-1 border-t-2 border-line bg-surface">
                <RunSummary
                  end={soloEnd}
                  bottomInset={insets.bottom + RAIL_BOTTOM_GAP}
                  onRevealMissed={onRevealMissed}
                  capLine={view.mode === 'solo' ? view.capLine : undefined}
                  isPicked={view.mode === 'solo' && view.isPicked}
                  isPractice={view.mode === 'solo' && view.isPractice}
                  onPlayAgain={onPlayAgain}
                  onChangeFilters={onChangeFilters}
                  onBackToPlay={onBackToPlay}
                  onPlayDuel={onPlayDuel}
                />
              </View>
            ) : result && view.mode === 'duel' ? (
              <View className="flex-1 border-t-2 border-line bg-surface">
                <DuelResultPanel
                  result={result}
                  isConnectionLost={view.endReason === 'connectionLost'}
                  bottomInset={insets.bottom + RAIL_BOTTOM_GAP}
                  isPrivate={view.isPrivate}
                  hostAccess={view.hostAccess}
                  onPlayAgain={onPlayAgain}
                  onChangeFilters={onChangeFilters}
                  onBackToPlay={onBackToPlay}
                />
              </View>
            ) : (
              <>
                {/* Holds the band's room, so a list opening never moves the turf */}
                {isFloating ? (
                  <View
                    // The band's measured height, known only at run time
                    style={{ height: bandHeight }}
                  />
                ) : null}
                <View
                  onLayout={isBand ? measureBand : undefined}
                  className={
                    isFloating
                      ? 'absolute inset-x-0 bottom-0 border-t-2 border-transparent px-4 py-2'
                      : isBand
                        ? 'border-t-2 border-line bg-surface px-4 py-2'
                        : 'border-t-2 border-line bg-surface px-4 pt-3'
                  }
                  // The home indicator's inset is known only at run time
                  style={
                    isBand
                      ? undefined
                      : { paddingBottom: insets.bottom + RAIL_BOTTOM_GAP }
                  }
                >
                  {/* The band's face stays its own height as the list opens */}
                  {isFloating ? (
                    <View
                      pointerEvents="none"
                      className="absolute inset-x-0 bottom-0 border-t-2 border-line bg-surface"
                      // The band's measured height, known only at run time
                      style={{ height: bandHeight }}
                    />
                  ) : null}
                  <ActiveRail
                    view={view}
                    guess={guess}
                    suggestions={suggestions}
                    onGuessChange={onGuessChange}
                    onGuessSubmit={onGuessSubmit}
                    isBand={isBand}
                    canFocus={view.gate === null}
                    onListOpenChange={setIsListOpen}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </CanvasGate>
      <LifeLostFlash flashKey={view.lifeLostKey} />
    </View>
  );
};

export default GameCanvas;
