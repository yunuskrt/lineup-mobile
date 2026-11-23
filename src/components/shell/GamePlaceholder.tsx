import React, { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Hammer } from 'lucide-react-native';
import QuitChip from '@/components/shell/QuitChip';
import Screen from '@/components/shell/Screen';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { useGameBack } from '@/hooks/use-game-back';
import { searchParamsOf } from '@/lib/route-params';
import { SECTION_LABEL } from '@/styles/classes';
import type { RouteParams } from '@/types/route-params';

type Props = {
  title: string;
  builtIn: string;
};

// The duel screen until M17 and M18: Quit and Back both ask first
const GamePlaceholder = ({ title, builtIn }: Props) => {
  const [isAsking, setIsAsking] = useState(false);
  // What /play handed over, so the hand-off can be checked
  const received = [...searchParamsOf(useLocalSearchParams<RouteParams>())];
  const ask = () => setIsAsking(true);
  useGameBack(ask);

  return (
    <Screen title={title} headerAction={<QuitChip onQuit={ask} />}>
      <StateNotice tone="info" icon={Hammer} message={`Built in ${builtIn}.`} />
      <View className="gap-2">
        <Text className={SECTION_LABEL}>Received</Text>
        {received.length === 0 ? (
          <Text className="text-14 text-fg-muted">No params</Text>
        ) : (
          received.map(([key, value], index) => (
            <Text key={`${key}-${index}`} className="text-14">
              {key} = {value}
            </Text>
          ))
        )}
      </View>
      <Dialog
        isOpen={isAsking}
        title="Leave this screen?"
        message="The real quit and forfeit dialogs arrive with the game."
        onCancel={() => setIsAsking(false)}
      >
        <Button label="Stay" onPress={() => setIsAsking(false)} />
        <Button
          label="Leave"
          variant="secondary"
          onPress={() => {
            setIsAsking(false);
            router.dismissTo('/play');
          }}
        />
      </Dialog>
    </Screen>
  );
};

export default GamePlaceholder;
