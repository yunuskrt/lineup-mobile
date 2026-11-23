import React, { useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import Pitch from '@/components/pitch/Pitch';
import GridSlot from '@/components/pitch/squad-grid/GridSlot';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { LOADING_FORMATION, slotLayout } from '@/lib/formation';
import { newRevealIds } from '@/lib/new-reveals';
import { discSize, fitPitch, labelSize, slotWidth } from '@/lib/squad-grid';
import type { GridPulse } from '@/types/feedback';
import type { FoundPlayer, RevealedPlayer } from '@/types/player';

type Props = {
  formation: string;
  revealed: FoundPlayer[];
  // Pro only, and only once the player reveals
  missed?: RevealedPlayer[];
  // An "Already named": that player's slot pulses once
  pulse?: GridPulse;
  isLoading?: boolean;
};

// Eleven slots on an upright pitch, always all eleven
const SquadGrid = ({
  formation,
  revealed,
  missed,
  pulse,
  isLoading = false,
}: Props) => {
  const runs = useMotionPolicy();
  // Missed slots already there as the board opens are drawn at once
  const [hadMissedOnMount] = useState(missed !== undefined);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [previousRevealed, setPreviousRevealed] = useState(revealed);
  const [wasLoading, setWasLoading] = useState(isLoading);
  const [newIds, setNewIds] = useState<ReadonlySet<string>>(() => new Set());

  if (revealed !== previousRevealed || isLoading !== wasLoading) {
    setPreviousRevealed(revealed);
    setWasLoading(isLoading);
    // Whatever is there as loading ends is a snapshot
    setNewIds(
      newRevealIds(previousRevealed, revealed, isLoading || wasLoading),
    );
  }

  const layout = isLoading ? LOADING_FORMATION : formation;
  const points = slotLayout(layout);
  const pitch = fitPitch(box.width, box.height);
  const size = {
    disc: discSize(layout, pitch.width),
    label: labelSize(pitch.width),
  };
  const width = slotWidth(layout, pitch.width);
  const playersBySlot = new Map(
    revealed.map((player) => [player.slot, player]),
  );
  const missedBySlot = new Map(
    (missed ?? []).map((player) => [player.slot, player]),
  );
  // Goalkeeper first: the order the slots appear in
  const missedRankBySlot = new Map(
    [...missedBySlot.keys()]
      .sort((a, b) => a - b)
      .map((slot, rank) => [slot, rank]),
  );
  const isRevealAnimated = !hadMissedOnMount && runs('missedReveal');

  const measure = (event: LayoutChangeEvent) => {
    const { width: boxWidth, height: boxHeight } = event.nativeEvent.layout;
    setBox({ width: boxWidth, height: boxHeight });
  };

  return (
    <View onLayout={measure} className="flex-1 items-center justify-center">
      {pitch.width > 0 ? (
        <View
          accessibilityLabel={isLoading ? 'Loading squad' : 'Starting XI'}
          className="overflow-hidden"
          // The pitch fits its box at run time, at 5:6
          style={{ width: pitch.width, height: pitch.height }}
        >
          <Pitch width={pitch.width} height={pitch.height} />
          {points ? (
            points.map((point) => {
              const player = playersBySlot.get(point.slot);
              return (
                <View
                  key={point.slot}
                  className="absolute"
                  // The point is the disc's foot, so reveals never shift
                  style={{
                    width,
                    left: (point.x / 100) * pitch.width - width / 2,
                    top: (point.y / 100) * pitch.height - size.disc,
                  }}
                >
                  <GridSlot
                    position={point.position}
                    size={size}
                    player={player}
                    missedPlayer={missedBySlot.get(point.slot)}
                    missedRank={
                      isRevealAnimated
                        ? (missedRankBySlot.get(point.slot) ?? 0)
                        : null
                    }
                    isLoading={isLoading}
                    isNew={player !== undefined && newIds.has(player.id)}
                    pulseKey={
                      player !== undefined && pulse?.playerId === player.id
                        ? pulse.key
                        : undefined
                    }
                  />
                </View>
              );
            })
          ) : (
            <View className="absolute inset-0 items-center justify-center p-4">
              <Text
                accessibilityRole="alert"
                className="text-center text-14 text-fg-muted"
              >
                Couldn’t lay out this formation
              </Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default SquadGrid;
