import React, { useState } from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import Pitch from '@/components/pitch/Pitch';
import GridSlot from '@/components/pitch/squad-grid/GridSlot';
import { Text } from '@/components/ui/text';
import { LOADING_FORMATION, slotLayout } from '@/lib/formation';
import { discSize, fitPitch, labelSize, slotWidth } from '@/lib/squad-grid';
import type { FoundPlayer, RevealedPlayer } from '@/types/player';

type Props = {
  formation: string;
  revealed: FoundPlayer[];
  // Pro only, and only once the player reveals
  missed?: RevealedPlayer[];
  isLoading?: boolean;
};

// Eleven slots on an upright pitch, always all eleven
const SquadGrid = ({
  formation,
  revealed,
  missed,
  isLoading = false,
}: Props) => {
  const [box, setBox] = useState({ width: 0, height: 0 });
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
            points.map((point) => (
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
                  player={playersBySlot.get(point.slot)}
                  missedPlayer={missedBySlot.get(point.slot)}
                  isLoading={isLoading}
                />
              </View>
            ))
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
