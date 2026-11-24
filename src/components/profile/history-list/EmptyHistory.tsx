import React from 'react';
import { router } from 'expo-router';
import { History } from 'lucide-react-native';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';

type Props = {};

const EmptyHistory = ({}: Props) => {
  return (
    <StateNotice
      tone="empty"
      icon={History}
      title="No games yet"
      message="Your solo runs and duels will be listed here."
    >
      <Button label="Play" onPress={() => router.navigate('/play')} />
    </StateNotice>
  );
};

export default EmptyHistory;
