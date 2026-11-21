import React from 'react';
import { Stack } from 'expo-router';

type Props = {};

// Full screen, no tab bar, no swipe out of a run
const GameLayout = ({}: Props) => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
      }}
    />
  );
};

export default GameLayout;
