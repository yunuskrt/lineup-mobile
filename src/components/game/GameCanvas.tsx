import React, { type ReactNode, useDeferredValue, useMemo } from 'react';
import { KeyboardAvoidingView, useWindowDimensions, View } from 'react-native';
import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CircleAlert, Hammer, WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CanvasGate from '@/components/game/CanvasGate';
import FoundCount from '@/components/game/FoundCount';
import ActiveRail from '@/components/game/game-canvas/ActiveRail';
import GateAction from '@/components/game/game-canvas/GateAction';
import GateCountdown from '@/components/game/game-canvas/GateCountdown';
import GateSeconds from '@/components/game/game-canvas/GateSeconds';
import LifeLostFlash from '@/components/game/LifeLostFlash';
import MatchHeader from '@/components/game/MatchHeader';
import SquadGrid from '@/components/pitch/SquadGrid';
import QuitChip from '@/components/shell/QuitChip';
import StateNotice from '@/components/shell/StateNotice';
import { Alert } from '@/components/ui/alert';
import { IconTile } from '@/components/ui/icon-tile';
import {
  gateSize,
  laterGatePart,
  laterPartLine,
  laterRailPart,
} from '@/lib/canvas-parts';
import { LOADING_FORMATION } from '@/lib/formation';
import { suggest, type SuggestionIndex } from '@/lib/suggestions';
import { missedOnPitch } from '@/lib/summary';
import { cn } from '@/lib/utils';
import { isShortScreen } from '@/lib/welcome';
import type { CanvasGateView, CanvasView } from '@/types/canvas';
import type { LaterPart } from '@/types/canvas-gate';

// The rail's own gap above the home indicator
const RAIL_BOTTOM_GAP = 12;

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

function laterNotice(part: LaterPart): ReactNode {
  return (
    <StateNotice
      tone="info"
      icon={Hammer}
      message={laterPartLine(part)}
      isCompact
    />
  );
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
}: Props) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const isShort = isShortScreen(useWindowDimensions().height);
  const soloEnd = view.mode === 'solo' ? view.end : null;
  const result = view.mode === 'duel' ? view.end : null;
  const summary = soloEnd?.status === 'ready' ? soloEnd.summary : null;
  const isPerfectClear = summary?.endReason === 'perfect_clear';
  // The result's own actions take over from quit
  const hasQuit = summary === null && result === null;
  const found = result?.found ?? view.found;
  const railPart = laterRailPart(view);
  const gatePart = laterGatePart(view);
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

  return (
    <View className="flex-1 bg-surface">
      {/* Light over the ink only while the board is the screen in view */}
      {isFocused ? <StatusBar style="light" /> : null}
      {/* Over the scrim, so a gate never traps the player */}
      {hasQuit ? (
        <View
          pointerEvents="box-none"
          className="absolute inset-x-0 top-0 z-10"
          // The status bar's height is known only at run time
          style={{ paddingTop: insets.top }}
        >
          <View
            className={cn('justify-center px-0.5', isShort ? 'h-11' : 'h-28')}
          >
            <QuitChip onQuit={onQuit} isOnScoreboard />
          </View>
        </View>
      ) : null}
      <CanvasGate
        isOpen={view.gate !== null}
        icon={notice.icon}
        title={view.gate?.title ?? ''}
        detail={notice.detail}
        size={gateSize(view)}
        body={gatePart ? laterNotice(gatePart) : notice.body}
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
        {/* Until M11b's band: padding keeps the input above the keyboard */}
        <KeyboardAvoidingView behavior="padding" className="flex-1">
          <View
            className="border-b-2 border-line bg-scoreboard"
            // The scoreboard runs up under the status bar
            style={{ paddingTop: insets.top }}
          >
            <MatchHeader match={view.match} isCompact={isShort} hasControls />
          </View>
          <View className="flex-1 bg-turf p-2">
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
          <View
            className="border-t-2 border-line bg-surface px-4 pt-3"
            // The home indicator's inset is known only at run time
            style={{ paddingBottom: insets.bottom + RAIL_BOTTOM_GAP }}
          >
            {railPart ? (
              laterNotice(railPart)
            ) : (
              <ActiveRail
                view={view}
                guess={guess}
                suggestions={suggestions}
                onGuessChange={onGuessChange}
                onGuessSubmit={onGuessSubmit}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </CanvasGate>
      <LifeLostFlash flashKey={view.lifeLostKey} />
    </View>
  );
};

export default GameCanvas;
