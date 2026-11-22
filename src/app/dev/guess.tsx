import React, { useDeferredValue, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DevSection } from '@/components/dev/DevSection';
import GuessInput from '@/components/game/GuessInput';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import {
  GUESS_OUTCOME_OPTIONS,
  SAMPLE_SUGGESTION_INDEX,
  sampleDirectoryKey,
  samplePlayer,
} from '@/lib/dev/samples';
import { guessFeedback } from '@/lib/feedback';
import { suggest } from '@/lib/suggestions';
import { TYPE_TITLE } from '@/styles/classes';
import type { GuessOutcome, GuessResult } from '@/types/game';
import type { GuessInputStatus } from '@/types/guess-input';

const STATUSES: GuessInputStatus[] = ['live', 'pending', 'locked', 'cooldown'];

// One named row, as if found earlier in the run
const NAMED_KEYS = new Set([sampleDirectoryKey('Rhys Harlow')]);
const OPEN_LIST_QUERY = 'har';

const SERVER_DELAY_MS = 600;
const NEXT_ROUND_DELAY_MS = 900;
const COOLDOWN_MS = 8000;
// Long enough for the keyboard to finish going down
const KEYBOARD_SETTLE_MS = 800;

// A rate limit's wait is on this device's clock
function cooldownDeadline(): number {
  return Date.now() + COOLDOWN_MS;
}

function verdictFor(outcome: GuessOutcome): GuessResult {
  if (outcome === 'correct_new') {
    return { outcome, player: samplePlayer('4-4-2', 0) };
  }
  if (outcome === 'already_found') {
    return { outcome, playerId: 'sample-0' };
  }
  return { outcome };
}

type Props = {};

// The input pinned above the keyboard, as the band will hold it
const GuessScreen = ({}: Props) => {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const [status, setStatus] = useState<GuessInputStatus>('live');
  const [cooldownUntil, setCooldownUntil] = useState<number>();
  const [value, setValue] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [nextOutcome, setNextOutcome] = useState<GuessOutcome>('not_in_xi');
  const [submissions, setSubmissions] = useState<string[]>([]);
  const [raiseMs, setRaiseMs] = useState<number[]>([]);
  const raiseStartedAt = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const query = useDeferredValue(value);
  const suggestions = suggest(SAMPLE_SUGGESTION_INDEX, query, NAMED_KEYS);

  useEffect(() => {
    const shown = Keyboard.addListener('keyboardDidShow', () => {
      const startedAt = raiseStartedAt.current;
      if (startedAt === null) return;
      raiseStartedAt.current = null;
      setRaiseMs((current) => [Date.now() - startedAt, ...current]);
    });
    return () => {
      shown.remove();
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  function clearPending() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }

  function schedule(delayMs: number, action: () => void) {
    clearPending();
    timer.current = setTimeout(action, delayMs);
  }

  function apply(result: GuessResult) {
    const feedback = guessFeedback(result);
    if (feedback.clearInput) setValue('');
    if (feedback.shakeInput) setShakeKey((key) => key + 1);
    if (result.outcome === 'correct_new') {
      setStatus('locked');
      schedule(NEXT_ROUND_DELAY_MS, () => setStatus('live'));
      return;
    }
    setStatus('live');
  }

  function handleSubmit(guess: string) {
    setSubmissions((current) => [guess, ...current]);
    setStatus('pending');
    schedule(SERVER_DELAY_MS, () => apply(verdictFor(nextOutcome)));
  }

  function forceStatus(next: GuessInputStatus) {
    clearPending();
    setCooldownUntil(next === 'cooldown' ? cooldownDeadline() : undefined);
    setStatus(next);
  }

  function openList() {
    forceStatus('live');
    setValue(OPEN_LIST_QUERY);
  }

  // From the field turning live to the keyboard in place
  function timeKeyboard() {
    forceStatus('locked');
    Keyboard.dismiss();
    schedule(KEYBOARD_SETTLE_MS, () => {
      raiseStartedAt.current = Date.now();
      setStatus('live');
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Edge to edge: Android doesn't resize, so pad on both */}
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-8 px-4 pb-8 pt-4"
        >
          <Text className={`${TYPE_TITLE} text-fg`}>Guess</Text>
          <DevSection id="outcome" title="Next outcome" only={section}>
            <View className="flex-row flex-wrap gap-3">
              {GUESS_OUTCOME_OPTIONS.map((outcome) => (
                <FilterChip
                  key={outcome.value}
                  label={outcome.label}
                  isOn={nextOutcome === outcome.value}
                  onPress={() => setNextOutcome(outcome.value)}
                />
              ))}
            </View>
          </DevSection>
          <DevSection id="status" title="Force status" only={section}>
            <View className="flex-row flex-wrap gap-3">
              {STATUSES.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  isOn={status === option}
                  onPress={() => forceStatus(option)}
                />
              ))}
            </View>
            <View className="flex-row flex-wrap gap-3">
              <Button
                label="Shake"
                variant="secondary"
                onPress={() => setShakeKey((key) => key + 1)}
              />
              <Button
                label="Open list"
                variant="secondary"
                onPress={openList}
              />
            </View>
          </DevSection>
          <DevSection id="keyboard" title="Keyboard raise" only={section}>
            <Button
              label="Time the keyboard"
              variant="secondary"
              onPress={timeKeyboard}
            />
            <Text className="text-14 text-fg-muted">
              {raiseMs.length > 0
                ? `${Platform.OS}: ${raiseMs.join(', ')} ms`
                : 'Dismisses the keyboard, then times its rise.'}
            </Text>
          </DevSection>
          <DevSection id="submitted" title="Submitted" only={section}>
            {submissions.map((guess, index) => (
              <Text
                key={submissions.length - index}
                className="text-14 text-fg"
              >
                {JSON.stringify(guess)}
              </Text>
            ))}
          </DevSection>
        </ScrollView>
        <View className="border-t-2 border-line bg-surface px-4 pb-3 pt-3">
          <GuessInput
            status={status}
            cooldownUntil={cooldownUntil}
            value={value}
            onValueChange={setValue}
            onSubmit={handleSubmit}
            shakeKey={shakeKey}
            suggestions={suggestions}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GuessScreen;
