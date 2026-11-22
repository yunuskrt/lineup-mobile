import React, { useState } from 'react';
import { View } from 'react-native';
import { DevScreen } from '@/components/dev/DevSection';
import SquadGrid from '@/components/pitch/SquadGrid';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import { SAMPLE_NAMES, samplePlayer } from '@/lib/dev/samples';
import type { DuelActor } from '@/types/duel';
import type { FoundPlayer } from '@/types/player';

const FORMATIONS = ['4-4-2', '3-5-2'];

// Scattered, so reveals land all over the pitch
const REVEAL_ORDER = [4, 9, 0, 5, 10, 2, 7, 1, 6, 3, 8];

const SNAPSHOT_SIZE = 4;

function playerAt(
  formation: string,
  slot: number,
  foundBy: DuelActor,
): FoundPlayer {
  return { ...samplePlayer(formation, slot), foundBy };
}

function nextSlots(revealed: FoundPlayer[], count: number): number[] {
  const taken = new Set(revealed.map((player) => player.slot));
  return REVEAL_ORDER.filter((slot) => !taken.has(slot)).slice(0, count);
}

type Props = {};

// A found player springs in; a snapshot doesn't
const RevealScreen = ({}: Props) => {
  const [formation, setFormation] = useState(FORMATIONS[0]);
  const [revealed, setRevealed] = useState<FoundPlayer[]>([]);
  const [gridKey, setGridKey] = useState(0);
  const isFull = revealed.length === SAMPLE_NAMES.length;

  function reveal(count: number, foundBy: DuelActor) {
    setRevealed((current) => [
      ...current,
      ...nextSlots(current, count).map((slot) =>
        playerAt(formation, slot, foundBy),
      ),
    ]);
  }

  function mountSnapshot() {
    setRevealed(
      nextSlots([], SNAPSHOT_SIZE).map((slot, index) =>
        playerAt(formation, slot, index % 2 === 0 ? 'you' : 'opponent'),
      ),
    );
    setGridKey((key) => key + 1);
  }

  function switchFormation(next: string) {
    setFormation(next);
    setRevealed([]);
    setGridKey((key) => key + 1);
  }

  return (
    <DevScreen title="Reveal">
      <View className="flex-row flex-wrap gap-3">
        {FORMATIONS.map((option) => (
          <FilterChip
            key={option}
            label={option}
            isOn={formation === option}
            onPress={() => switchFormation(option)}
          />
        ))}
      </View>
      <View className="flex-row flex-wrap gap-3">
        <Button
          label="You reveal next"
          variant="secondary"
          isDisabled={isFull}
          onPress={() => reveal(1, 'you')}
        />
        <Button
          label="Opponent reveals next"
          variant="secondary"
          isDisabled={isFull}
          onPress={() => reveal(1, 'opponent')}
        />
        <Button
          label="Reveal two at once"
          variant="secondary"
          isDisabled={isFull}
          onPress={() => reveal(2, 'you')}
        />
        <Button
          label={`Mount with ${SNAPSHOT_SIZE} revealed`}
          variant="secondary"
          onPress={mountSnapshot}
        />
        <Button
          label="Reset"
          variant="secondary"
          onPress={() => setRevealed([])}
        />
      </View>
      <Text className="text-12 text-fg-muted">
        {revealed.length} / {SAMPLE_NAMES.length} named
      </Text>
      <View className="h-[440px] overflow-hidden rounded-lg border-2 border-line">
        <SquadGrid key={gridKey} formation={formation} revealed={revealed} />
      </View>
    </DevScreen>
  );
};

export default RevealScreen;
