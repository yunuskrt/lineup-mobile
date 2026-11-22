import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import MatchHeader from '@/components/game/MatchHeader';
import SquadGrid from '@/components/pitch/SquadGrid';
import { Text } from '@/components/ui/text';
import { SAMPLE_MATCH, samplePlayer } from '@/lib/dev/samples';
import { slotLayout } from '@/lib/formation';
import type { MatchInPlay } from '@/types/match';
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

const AWAY_NAMED: MatchInPlay = { ...SAMPLE_MATCH, side: 'away' };
const NO_IMAGES: MatchInPlay = {
  ...SAMPLE_MATCH,
  home: { ...SAMPLE_MATCH.home, crestUrl: null },
  away: { ...SAMPLE_MATCH.away, crestUrl: null },
  competition: { ...SAMPLE_MATCH.competition, logoUrl: null },
};

type BoardProps = {
  label: string;
  match: MatchInPlay | null;
  isCompact?: boolean;
};

// The header over the pitch, as a game board stacks them
const Board = ({ label, match, isCompact }: BoardProps) => {
  return (
    <View className="gap-2">
      <Text className="text-12 text-fg-muted">{label}</Text>
      <View className="overflow-hidden rounded-lg border-2 border-line">
        <MatchHeader match={match} isCompact={isCompact} hasControls />
        <View className="h-[300px]">
          <SquadGrid
            formation={match?.formation ?? '4-4-2'}
            revealed={match ? samplePlayers(match.formation, false) : []}
            isLoading={!match}
          />
        </View>
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
      <DevSection id="header" title="Match header" only={section}>
        <Board label="Full, home side named" match={SAMPLE_MATCH} />
        <Board label="Full, away side named" match={AWAY_NAMED} />
        <Board
          label="Compact, the keyboard band"
          match={SAMPLE_MATCH}
          isCompact
        />
        <Board label="No crest or logo: the fallbacks" match={NO_IMAGES} />
        <Board label="Loading, full" match={null} />
        <Board label="Loading, compact" match={null} isCompact />
      </DevSection>
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
