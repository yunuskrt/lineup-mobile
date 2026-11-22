import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, View } from 'react-native';
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
import type { CanvasView } from '@/types/canvas';

type Props = {
  view: CanvasView;
  guess: string;
  suggestions: readonly Suggestion[];
  onGuessChange: (value: string) => void;
  onGuessSubmit: (guess: string) => void;
};

const ActiveRail = ({
  view,
  guess,
  suggestions,
  onGuessChange,
  onGuessSubmit,
}: Props) => {
  const turn = view.mode === 'duel' ? view.turn : null;
  const isTheirTurn = turn === 'opponent';
  const isReconnecting =
    view.mode === 'duel' && view.opponentConnection?.status === 'reconnecting';
  const sticker = clockLabel(view.mode, turn).actor;
  const announcement =
    view.mode === 'duel' ? turnAnnouncement(turn, isReconnecting) : '';
  const announced = useRef(announcement);

  // Spoken on a change only, as the web's polite live region
  useEffect(() => {
    if (announcement === announced.current) return;
    announced.current = announcement;
    if (announcement) AccessibilityInfo.announceForAccessibility(announcement);
  }, [announcement]);

  return (
    <View className="gap-1">
      {view.mode === 'solo' && view.isPractice ? (
        <PracticeCard />
      ) : (
        <View className="flex-row items-center gap-4 border-b-2 border-line pb-3">
          <ClockBlock view={view} />
          <View className="min-w-0 flex-1 gap-3 self-stretch justify-center border-l-2 border-line pl-4">
            <RailLives view={view} />
            {sticker ? <TurnSticker turn={sticker} /> : null}
          </View>
        </View>
      )}
      <FeedbackToast toast={view.toast} />
      {/* One height for both, so the handover doesn't shift the board */}
      <View className="min-h-[72px] justify-center">
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
          />
        )}
      </View>
    </View>
  );
};

export default ActiveRail;
