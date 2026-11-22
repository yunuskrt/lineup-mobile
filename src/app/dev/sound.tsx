import React, { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import SoundToggle from '@/components/game/SoundToggle';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSound } from '@/hooks/use-sound';
import {
  FINAL_BEEP_FROM,
  finalBeepFor,
  OPPONENT_TICK_GAIN,
} from '@/styles/sound';
import type { SoundCue } from '@/types/sound';

const SECOND_MS = 1000;

const CUE_EVENTS: { cue: SoundCue; event: string }[] = [
  { cue: 'correctNew', event: 'You name a new player' },
  { cue: 'theirReveal', event: 'Opponent names a new player' },
  { cue: 'notInXi', event: 'Not in this XI' },
  { cue: 'alreadyNamed', event: 'Already named' },
  { cue: 'tick', event: 'Each second, 14 → 6' },
  { cue: 'lifeLost', event: 'You lose a life' },
  { cue: 'theirLifeLost', event: 'Opponent loses a life' },
  { cue: 'turnToYou', event: 'The turn passes to you' },
  { cue: 'opponentFound', event: 'Matchmaking pairs you' },
  { cue: 'resultWin', event: 'Duel win or forfeit win' },
  { cue: 'resultDraw', event: 'Duel draw' },
  { cue: 'resultLoss', event: 'Duel loss' },
  { cue: 'perfectClear', event: 'Solo: all 11 named' },
  { cue: 'runOver', event: 'Solo: lives at 0' },
];

const FINAL_SECONDS = Array.from(
  { length: FINAL_BEEP_FROM },
  (_, index) => FINAL_BEEP_FROM - index,
);

type Props = {};

// The web's SoundPreview: every cue and the clock, one tap each
const SoundScreen = ({}: Props) => {
  const { play } = useSound();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function playBeep(seconds: number) {
    const beep = finalBeepFor(seconds);
    if (beep) play(beep);
  }

  function playFinalFive() {
    timers.current.forEach(clearTimeout);
    timers.current = FINAL_SECONDS.map((seconds, index) =>
      setTimeout(() => playBeep(seconds), index * SECOND_MS),
    );
  }

  return (
    <DevScreen title="Sound">
      <DevSection id="mute" title="Mute">
        <View className="flex-row items-center gap-3">
          <View className="rounded-md border-2 border-line bg-surface-card">
            <SoundToggle />
          </View>
          <Text className="min-w-0 flex-1 text-14 text-fg-muted">
            Remembered on this device. The silent switch silences it too.
          </Text>
        </View>
      </DevSection>
      <DevSection id="clock" title="Clock">
        <View className="flex-row flex-wrap gap-2">
          <Button label="Final 5" onPress={playFinalFive} />
          {FINAL_SECONDS.map((seconds) => (
            <Button
              key={seconds}
              label={`${seconds}s`}
              variant="secondary"
              onPress={() => playBeep(seconds)}
            />
          ))}
          <Button
            label="Their tick, half gain"
            variant="secondary"
            onPress={() => play('tick', { gainScale: OPPONENT_TICK_GAIN })}
          />
        </View>
      </DevSection>
      <DevSection id="cues" title="Cues">
        <View className="border-t-2 border-line">
          {CUE_EVENTS.map(({ cue, event }) => (
            <Pressable
              key={cue}
              accessibilityRole="button"
              accessibilityLabel={`${cue}: ${event}`}
              onPress={() => play(cue)}
              className="min-h-11 gap-0.5 border-b-2 border-line py-3 active:bg-surface-raised"
            >
              <Text className="font-body-semibold text-14">{cue}</Text>
              <Text className="text-12 text-fg-muted">{event}</Text>
            </Pressable>
          ))}
        </View>
      </DevSection>
    </DevScreen>
  );
};

export default SoundScreen;
