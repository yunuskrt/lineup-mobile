import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Keyboard, View } from 'react-native';
import FeedbackToast from '@/components/game/FeedbackToast';
import ClockBlock from '@/components/game/game-canvas/ClockBlock';
import RailLives from '@/components/game/game-canvas/RailLives';
import GuessInput from '@/components/game/GuessInput';
import PracticeCard from '@/components/game/PracticeCard';
import TurnSticker from '@/components/game/TurnSticker';
import { Text } from '@/components/ui/text';
import { clockLabel } from '@/lib/canvas';
import { turnAnnouncement, waitingLine } from '@/lib/duel-status';
import type { Suggestion } from '@/lib/suggestions';
import { cn } from '@/lib/utils';
import type { CanvasView } from '@/types/canvas';

type Props = {
  view: CanvasView;
  guess: string;
  suggestions: readonly Suggestion[];
  onGuessChange: (value: string) => void;
  onGuessSubmit: (guess: string) => void;
  // Keyboard up on your turn: one row over the input, pinned above it
  isBand: boolean;
  // False under a gate
  canFocus: boolean;
  onListOpenChange: (isOpen: boolean) => void;
};

const ActiveRail = ({
  view,
  guess,
  suggestions,
  onGuessChange,
  onGuessSubmit,
  isBand,
  canFocus,
  onListOpenChange,
}: Props) => {
  const turn = view.mode === 'duel' ? view.turn : null;
  const isTheirTurn = turn === 'opponent';
  const isReconnecting =
    view.mode === 'duel' && view.opponentConnection?.status === 'reconnecting';
  const sticker = clockLabel(view.mode, turn).actor;
  const announcement =
    view.mode === 'duel' ? turnAnnouncement(turn, isReconnecting) : '';
  const announced = useRef(announcement);
  const isPractice = view.mode === 'solo' && view.isPractice;

  // Their turn: the full board shows their reveals, not the keyboard
  useEffect(() => {
    if (isTheirTurn) Keyboard.dismiss();
  }, [isTheirTurn]);

  // Spoken on a change only, as the web's polite live region
  useEffect(() => {
    if (announcement === announced.current) return;
    announced.current = announcement;
    if (announcement) AccessibilityInfo.announceForAccessibility(announcement);
  }, [announcement]);

  const clockRow = isPractice ? null : (
    <View
      className={cn(
        'flex-row items-center border-b-2 border-line',
        isBand ? 'gap-3 pb-2' : 'gap-4 pb-3',
      )}
    >
      <ClockBlock view={view} size={isBand ? 'band' : 'full'} />
      <View
        className={cn(
          'min-w-0 flex-1',
          isBand
            ? 'flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1'
            : 'gap-3 self-stretch justify-center border-l-2 border-line pl-4',
        )}
      >
        <RailLives view={view} isCompact={isBand} />
        {sticker ? <TurnSticker turn={sticker} /> : null}
      </View>
    </View>
  );

  // One tree for rail and band, so the field keeps focus as they swap
  return (
    <View className={isBand ? undefined : 'gap-1'}>
      {/* The band's row goes inside the input, under its list */}
      {isBand ? null : (clockRow ?? <PracticeCard />)}
      {/* In the band it floats just above, over the turf */}
      <View
        pointerEvents="none"
        className={isBand ? 'absolute inset-x-0 bottom-full mb-2' : undefined}
      >
        <FeedbackToast toast={view.toast} />
      </View>
      {/* One height for both, so the handover doesn't shift the board */}
      <View className={isBand ? undefined : 'min-h-[72px] justify-center'}>
        {isTheirTurn ? (
          <Text className="text-center text-14 text-fg-muted">
            {waitingLine(
              view.mode === 'duel' ? (view.opponent?.handle ?? null) : null,
              isReconnecting,
            )}
          </Text>
        ) : (
          <GuessInput
            status={view.input}
            cooldownUntil={view.cooldownUntil}
            value={guess}
            onValueChange={onGuessChange}
            onSubmit={onGuessSubmit}
            shakeKey={view.shakeKey}
            suggestions={suggestions}
            canFocus={canFocus}
            onListOpenChange={onListOpenChange}
            header={isBand ? clockRow : null}
            hasLabel={!isBand}
          />
        )}
      </View>
    </View>
  );
};

export default ActiveRail;
