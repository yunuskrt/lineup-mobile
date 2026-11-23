import React from 'react';
import { View } from 'react-native';
import { Check } from 'lucide-react-native';
import { STATUS_ROW } from '@/components/duel/lobby-panel/styles';
import { Badge } from '@/components/ui/badge';
import type { DuelActor } from '@/types/duel';

type Props = { actor: DuelActor };

const LockedIn = ({ actor }: Props) => {
  return (
    <View className={STATUS_ROW}>
      <Badge
        label="Locked in"
        variant="sticker"
        tone={actor}
        tilt="none"
        icon={Check}
      />
    </View>
  );
};

export default LockedIn;
