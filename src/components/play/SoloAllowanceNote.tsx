import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PRO_PATH } from '@/lib/pro';

type Props = {
  // The server's count, as allowanceLine words it
  line: string;
  isCapped: boolean;
  onPlayDuel: () => void;
};

// At 0 it never dead-ends: a duel, or Pro
const SoloAllowanceNote = ({ line, isCapped, onPlayDuel }: Props) => {
  return (
    <View className="items-start gap-3">
      <Text className="text-14 text-fg-muted">{line}</Text>
      {isCapped ? (
        <View className="flex-row flex-wrap gap-3">
          <Button
            label="Play a duel"
            variant="secondary"
            onPress={onPlayDuel}
          />
          <Button
            label="See Pro"
            variant="secondary"
            onPress={() => router.push(PRO_PATH)}
          />
        </View>
      ) : null}
    </View>
  );
};

export default SoloAllowanceNote;
