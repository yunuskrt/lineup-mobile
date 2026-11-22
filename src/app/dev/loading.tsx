import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { DevScreen } from '@/components/dev/DevSection';
import CanvasGate from '@/components/game/CanvasGate';
import GuessInput from '@/components/game/GuessInput';
import SquadGrid from '@/components/pitch/SquadGrid';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import { samplePlayer } from '@/lib/dev/samples';
import { LOADING_FORMATION } from '@/lib/formation';
import { SECTION_LABEL } from '@/styles/classes';
import type { FoundPlayer } from '@/types/player';

const FORMATIONS = [LOADING_FORMATION, '3-5-2', '4-3-3'];

const ARRIVAL_FORMATION = '3-5-2';

const SNAPSHOT_SLOTS = [0, 4, 7, 10];

type GateSample = {
  label: string;
  title: string;
  detail?: string;
  actionLabel?: string;
};

const GATES: GateSample[] = [
  { label: 'Matchmaking', title: 'Finding an opponent', actionLabel: 'Cancel' },
  {
    label: 'Reconnecting',
    title: 'Reconnecting, 18s',
    detail: 'Your clock is still running',
  },
  { label: 'Pre-match', title: 'Match ready', actionLabel: 'Start' },
];

function snapshotPlayers(formation: string): FoundPlayer[] {
  return SNAPSHOT_SLOTS.map((slot) => ({
    ...samplePlayer(formation, slot),
    foundBy: slot % 2 === 0 ? 'you' : 'opponent',
  }));
}

type Props = {};

// The web's LoadingPreview: the squad skeleton and the gate
const LoadingScreen = ({}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formation, setFormation] = useState(LOADING_FORMATION);
  const [revealed, setRevealed] = useState<FoundPlayer[]>([]);
  const [gate, setGate] = useState<GateSample | null>(null);
  const [value, setValue] = useState('');
  const [boardTaps, setBoardTaps] = useState(0);
  const [submissions, setSubmissions] = useState(0);

  function toggleLoading() {
    if (!isLoading) setRevealed([]);
    setIsLoading(!isLoading);
  }

  function finishLoading() {
    setFormation(ARRIVAL_FORMATION);
    setRevealed(snapshotPlayers(ARRIVAL_FORMATION));
    setIsLoading(false);
  }

  return (
    <DevScreen title="Loading">
      <View className="gap-2">
        <Text className={SECTION_LABEL}>Loading</Text>
        <View className="flex-row flex-wrap gap-2">
          <FilterChip
            label="Loading"
            isOn={isLoading}
            onPress={toggleLoading}
          />
          {FORMATIONS.map((option) => (
            <FilterChip
              key={option}
              label={option}
              isOn={formation === option}
              onPress={() => setFormation(option)}
            />
          ))}
        </View>
        <Button
          label={`Finish loading with ${SNAPSHOT_SLOTS.length} revealed`}
          variant="secondary"
          onPress={finishLoading}
        />
      </View>
      <View className="gap-2">
        <Text className={SECTION_LABEL}>Gate</Text>
        <View className="flex-row flex-wrap gap-2">
          {GATES.map((sample) => (
            <FilterChip
              key={sample.label}
              label={sample.label}
              isOn={gate?.label === sample.label}
              onPress={() => setGate(sample)}
            />
          ))}
          <FilterChip
            label="Close"
            isOn={false}
            onPress={() => setGate(null)}
          />
        </View>
      </View>
      <Text className="text-12 text-fg-muted">
        Board taps: {boardTaps} · Guesses sent: {submissions}
      </Text>
      <View className="h-[480px] rounded-lg border-2 border-line bg-surface-raised p-2">
        <CanvasGate
          isOpen={gate !== null}
          title={gate?.title ?? ''}
          detail={gate?.detail}
          action={
            gate?.actionLabel ? (
              <Button label={gate.actionLabel} onPress={() => setGate(null)} />
            ) : undefined
          }
        >
          <View className="flex-1 gap-2">
            <Pressable
              accessibilityLabel="Board"
              onPress={() => setBoardTaps((count) => count + 1)}
              className="flex-1 bg-turf"
            >
              <SquadGrid
                formation={formation}
                revealed={revealed}
                isLoading={isLoading}
              />
            </Pressable>
            <GuessInput
              status="live"
              value={value}
              onValueChange={setValue}
              onSubmit={() => setSubmissions((count) => count + 1)}
              shakeKey={0}
            />
          </View>
        </CanvasGate>
      </View>
    </DevScreen>
  );
};

export default LoadingScreen;
