import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedbackToast from '@/components/game/FeedbackToast';
import GuessInput from '@/components/game/GuessInput';
import SquadGrid from '@/components/pitch/SquadGrid';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import { GUESS_OUTCOME_OPTIONS, samplePlayer } from '@/lib/dev/samples';
import { applyFeedback, guessFeedback } from '@/lib/feedback';
import type { FeedbackState } from '@/types/feedback';
import type { GuessOutcome, GuessResult } from '@/types/game';
import type { GuessInputStatus } from '@/types/guess-input';
import type { FoundPlayer } from '@/types/player';

const FORMATION = '4-4-2';

// Scattered, so reveals land all over the pitch
const REVEAL_ORDER = [0, 4, 7, 10, 2, 9, 5, 1, 8, 3, 6];

const STARTING_REVEALED = 4;

const SERVER_DELAY_MS = 400;

const INITIAL_REVEALED = REVEAL_ORDER.slice(0, STARTING_REVEALED).map((slot) =>
  samplePlayer(FORMATION, slot),
);

const INITIAL_FEEDBACK: FeedbackState = { toast: null, shakeKey: 0 };

type Props = {};

// The two verdict channels on one board: the grid and the input
const FeedbackScreen = ({}: Props) => {
  const [revealed, setRevealed] = useState<FoundPlayer[]>(INITIAL_REVEALED);
  const [status, setStatus] = useState<GuessInputStatus>('live');
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [nextOutcome, setNextOutcome] = useState<GuessOutcome>('already_found');
  const [pulseCursor, setPulseCursor] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  function verdictFor(outcome: GuessOutcome): GuessResult {
    if (outcome === 'correct_new') {
      const taken = new Set(revealed.map((player) => player.slot));
      const slot = REVEAL_ORDER.find((candidate) => !taken.has(candidate));
      if (slot !== undefined) {
        return { outcome, player: samplePlayer(FORMATION, slot) };
      }
      return { outcome: 'already_found', playerId: revealed[0].id };
    }
    if (outcome === 'already_found') {
      const player = revealed[pulseCursor % revealed.length];
      setPulseCursor((cursor) => cursor + 1);
      return { outcome, playerId: player.id };
    }
    return { outcome };
  }

  function apply(result: GuessResult) {
    const verdict = guessFeedback(result);
    if (result.outcome === 'correct_new') {
      setRevealed((current) => [...current, result.player]);
    }
    if (verdict.clearInput) setValue('');
    setFeedback((current) => applyFeedback(current, verdict));
    setStatus('live');
  }

  function handleSubmit() {
    const result = verdictFor(nextOutcome);
    setStatus('pending');
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => apply(result), SERVER_DELAY_MS);
  }

  function reset() {
    if (timer.current !== null) clearTimeout(timer.current);
    setRevealed(INITIAL_REVEALED);
    setStatus('live');
    setValue('');
    setFeedback(INITIAL_FEEDBACK);
    setPulseCursor(0);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Edge to edge: Android doesn't resize, so pad on both */}
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="gap-3 border-b-2 border-line px-4 pb-3 pt-2">
          <Text className="text-12 text-fg-muted">
            Type anything and send; the verdict is the one picked here.
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {GUESS_OUTCOME_OPTIONS.map((outcome) => (
              <FilterChip
                key={outcome.value}
                label={outcome.label}
                isOn={nextOutcome === outcome.value}
                onPress={() => setNextOutcome(outcome.value)}
              />
            ))}
            <Button label="Reset" variant="secondary" onPress={reset} />
          </View>
        </View>
        <View className="flex-1 bg-turf">
          <SquadGrid
            formation={FORMATION}
            revealed={revealed}
            pulse={feedback.pulse}
          />
        </View>
        <View className="gap-1 border-t-2 border-line bg-surface px-4 pb-3 pt-1">
          <FeedbackToast toast={feedback.toast} />
          <GuessInput
            status={status}
            value={value}
            onValueChange={setValue}
            onSubmit={handleSubmit}
            shakeKey={feedback.shakeKey}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;
