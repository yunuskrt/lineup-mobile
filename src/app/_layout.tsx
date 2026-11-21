import React from 'react';
import { Stack } from 'expo-router';
import '@/global.css';

type Props = {};

const RootLayout = ({}: Props) => {
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default RootLayout;
