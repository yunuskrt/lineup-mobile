import React, { useState } from 'react';
import { router } from 'expo-router';
import { Hammer } from 'lucide-react-native';
import QuitChip from '@/components/shell/QuitChip';
import Screen from '@/components/shell/Screen';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useGameBack } from '@/hooks/use-game-back';

type Props = {
  title: string;
  builtIn: string;
};

// A game screen until M14 and M18: Quit and Back both ask first
const GamePlaceholder = ({ title, builtIn }: Props) => {
  const [isAsking, setIsAsking] = useState(false);
  const ask = () => setIsAsking(true);
  useGameBack(ask);

  return (
    <Screen title={title} headerAction={<QuitChip onQuit={ask} />}>
      <StateNotice tone="info" icon={Hammer} message={`Built in ${builtIn}.`} />
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
