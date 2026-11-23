import React from 'react';
import { View } from 'react-native';
import PlayerCard from '@/components/duel/lobby-panel/PlayerCard';
import { Badge } from '@/components/ui/badge';
import type { DuelPlayer } from '@/types/duel';

type Props = { you: DuelPlayer; opponent: DuelPlayer };

// Reading order: you, vs, opponent
const Paired = ({ you, opponent }: Props) => {
  return (
    <View className="gap-3">
      <PlayerCard actor="you" player={you} />
      <View accessible accessibilityLabel="versus" className="items-center">
        {/* The badge aligns itself to the start; this box centres it */}
        <View>
          <Badge label="VS" variant="sticker" tone="butter" />
        </View>
      </View>
      <PlayerCard actor="opponent" player={opponent} />
    </View>
  );
};

export default Paired;
