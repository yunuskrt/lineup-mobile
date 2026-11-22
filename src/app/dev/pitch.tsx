import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import SquadGrid from '@/components/pitch/SquadGrid';
import { Text } from '@/components/ui/text';
import { samplePlayer } from '@/lib/dev/samples';
import { slotLayout } from '@/lib/formation';
import type { FoundPlayer, RevealedPlayer } from '@/types/player';

const FORMATIONS = [
  '4-4-2',
  '4-3-3',
  '4-2-3-1',
  '3-5-2',
  '3-4-3',
  '4-1-4-1',
  '4-1-2-1-2',
];

const PARTIAL_SLOTS = new Set([0, 3, 5, 9]);

function samplePlayers(formation: string, isFull: boolean): RevealedPlayer[] {
  return (slotLayout(formation) ?? [])
    .filter((point) => isFull || PARTIAL_SLOTS.has(point.slot))
    .map((point) => samplePlayer(formation, point.slot));
}

// Turn by turn, alternating, so both colours show
function duelPlayers(formation: string): FoundPlayer[] {
  return samplePlayers(formation, false).map((player, index) => ({
    ...player,
    foundBy: index % 2 === 0 ? 'you' : 'opponent',
  }));
}

function missedPlayers(formation: string): RevealedPlayer[] {
  return samplePlayers(formation, true).filter(
    (player) => !PARTIAL_SLOTS.has(player.slot),
  );
}

type SpecimenProps = {
  label: string;
  formation: string;
  revealed: FoundPlayer[];
  missed?: RevealedPlayer[];
  isLoading?: boolean;
};

const Specimen = ({
  label,
  formation,
  revealed,
  missed,
  isLoading,
}: SpecimenProps) => {
  return (
    <View className="gap-2">
      <Text className="text-12 text-fg-muted">{label}</Text>
      <View className="h-[440px] overflow-hidden rounded-lg border-2 border-line">
        <SquadGrid
          formation={formation}
          revealed={revealed}
          missed={missed}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

type Props = {};

// Every formation full, then each state; ?section= shows one
const PitchScreen = ({}: Props) => {
  const { section } = useLocalSearchParams<{ section?: string }>();
  return (
    <DevScreen title="Pitch">
      <DevSection id="formations" title="Formations, full" only={section}>
        {FORMATIONS.map((formation) => (
          <Specimen
            key={formation}
            label={formation}
            formation={formation}
            revealed={samplePlayers(formation, true)}
          />
        ))}
      </DevSection>
      <DevSection id="states" title="Empty and partial" only={section}>
        <Specimen label="4-2-3-1, empty" formation="4-2-3-1" revealed={[]} />
        <Specimen
          label="4-2-3-1, four named"
          formation="4-2-3-1"
          revealed={samplePlayers('4-2-3-1', false)}
        />
      </DevSection>
      <DevSection id="duel" title="Duel, by finder" only={section}>
        <Specimen
          label="4-3-3: blue is you, orange the opponent"
          formation="4-3-3"
          revealed={duelPlayers('4-3-3')}
        />
      </DevSection>
      <DevSection id="missed" title="Missed, after a run" only={section}>
        <Specimen
          label="4-4-2: four named, seven missed"
          formation="4-4-2"
          revealed={samplePlayers('4-4-2', false)}
          missed={missedPlayers('4-4-2')}
        />
      </DevSection>
      <DevSection id="loading" title="Loading" only={section}>
        <Specimen label="Loading" formation="4-3-3" revealed={[]} isLoading />
      </DevSection>
    </DevScreen>
  );
};

export default PitchScreen;
