import React, { type ReactNode, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import CountdownRing from '@/components/game/CountdownRing';
import TurnSticker from '@/components/game/TurnSticker';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import { ROUND_MS } from '@/lib/api/schemas/common';
import { serverClock } from '@/lib/server-clock';
import type { RingMode } from '@/types/countdown';
import type { DuelActor } from '@/types/duel';
import type { RoundTiming } from '@/types/game';

const MODES: RingMode[] = ['running', 'frozen', 'waiting'];

const STATIC_SPECIMENS: {
  label: string;
  remaining: number;
  mode: RingMode;
  owner?: DuelActor;
}[] = [
  { label: 'Calm, 12s', remaining: 12_000, mode: 'frozen' },
  { label: 'Warning, 6s', remaining: 6_000, mode: 'frozen' },
  { label: 'Critical, 2s', remaining: 2_000, mode: 'frozen' },
  { label: 'Time up, 0s', remaining: 0, mode: 'running' },
  { label: 'Waiting, 9s', remaining: 9_000, mode: 'waiting' },
  {
    label: 'Opponent, 9s',
    remaining: 9_000,
    mode: 'frozen',
    owner: 'opponent',
  },
];

function roundFrom(startedAt: number): RoundTiming {
  return { startedAt, endsAt: startedAt + ROUND_MS };
}

function roundLeaving(remaining: number, now: number): RoundTiming {
  return { startedAt: now - (ROUND_MS - remaining), endsAt: now + remaining };
}

type SpecimenProps = { label: string; children: ReactNode };

const Specimen = ({ label, children }: SpecimenProps) => {
  return (
    <View className="items-center gap-2">
      {children}
      <Text className="text-12 text-fg-muted">{label}</Text>
    </View>
  );
};

type Props = {};

// Every mode and stage of the clock; ?section= shows one
const RingScreen = ({}: Props) => {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const [openedAt] = useState(() => serverClock.now());
  const [startedAt, setStartedAt] = useState(openedAt);
  const [mode, setMode] = useState<RingMode>('running');
  const liveRound = roundFrom(startedAt);

  function restart() {
    setStartedAt(serverClock.now());
    setMode('running');
  }

  return (
    <DevScreen title="Ring">
      <DevSection id="live" title="Live" only={section}>
        <View className="flex-row flex-wrap items-center gap-3">
          <Button label="Restart" variant="secondary" onPress={restart} />
          {MODES.map((option) => (
            <FilterChip
              key={option}
              label={option}
              isOn={mode === option}
              onPress={() => setMode(option)}
            />
          ))}
        </View>
        <View className="flex-row flex-wrap gap-8">
          <Specimen label={`You, ${mode}`}>
            <CountdownRing round={liveRound} mode={mode} />
          </Specimen>
          <Specimen label="Opponent, running">
            <CountdownRing round={liveRound} mode="running" owner="opponent" />
          </Specimen>
        </View>
      </DevSection>
      <DevSection id="band" title="Band size" only={section}>
        <View className="flex-row flex-wrap gap-8">
          <Specimen label={`You, ${mode}`}>
            <CountdownRing round={liveRound} mode={mode} size="band" />
          </Specimen>
          {STATIC_SPECIMENS.map((specimen) => (
            <Specimen key={specimen.label} label={specimen.label}>
              <CountdownRing
                round={roundLeaving(specimen.remaining, openedAt)}
                mode={specimen.mode}
                owner={specimen.owner}
                size="band"
              />
            </Specimen>
          ))}
        </View>
      </DevSection>
      <DevSection id="static" title="Static" only={section}>
        <View className="flex-row flex-wrap gap-8">
          {STATIC_SPECIMENS.map((specimen) => (
            <Specimen key={specimen.label} label={specimen.label}>
              <CountdownRing
                round={roundLeaving(specimen.remaining, openedAt)}
                mode={specimen.mode}
                owner={specimen.owner}
              />
            </Specimen>
          ))}
        </View>
      </DevSection>
      <DevSection id="turn" title="Turn stickers" only={section}>
        <View className="flex-row gap-6">
          <TurnSticker turn="you" />
          <TurnSticker turn="opponent" />
        </View>
      </DevSection>
    </DevScreen>
  );
};

export default RingScreen;
