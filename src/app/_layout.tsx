import React from 'react';
import { Stack } from 'expo-router';

type Props = {};

const RootLayout = ({}: Props) => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default RootLayout;
