import React, { useState } from 'react';
import { View } from 'react-native';
import Shirt from '@/components/game/lives/Shirt';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { MAX_LIVES } from '@/lib/api/schemas/game';
import type { DuelActor } from '@/types/duel';
import type { Lives as LivesCount } from '@/types/game';

const PIPS = Array.from({ length: MAX_LIVES }, (_, index) => index);

type Drop = { from: number; to: number };

type Props = {
  lives: LivesCount;
  owner?: DuelActor;
  // The rail's larger shirts
  isLarge?: boolean;
};

// The server's count; a drop empties shirts, it never decides one
const Lives = ({ lives, owner = 'you', isLarge = false }: Props) => {
  const runs = useMotionPolicy();
  const [previousLives, setPreviousLives] = useState(lives);
  const [drop, setDrop] = useState<Drop | null>(null);

  if (lives !== previousLives) {
    setPreviousLives(lives);
    setDrop(lives < previousLives ? { from: previousLives, to: lives } : null);
  }

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${lives} of ${MAX_LIVES} lives left`}
      className={isLarge ? 'flex-row gap-1.5' : 'flex-row gap-1'}
    >
      {PIPS.map((index) => (
        <Shirt
          key={index}
          owner={owner}
          isFilled={index < lives}
          isEmptying={drop !== null && index >= drop.to && index < drop.from}
          shakes={runs('lifeShake')}
          isLarge={isLarge}
        />
      ))}
    </View>
  );
};

export default Lives;
