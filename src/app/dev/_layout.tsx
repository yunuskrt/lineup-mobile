import React from 'react';
import { Slot } from 'expo-router';
import NotFoundView from '@/components/shell/NotFoundView';

type Props = {};

// Dev pages 404 outside a dev build, as the web's requireDevEnv does
const DevLayout = ({}: Props) => {
  if (!__DEV__) return <NotFoundView />;
  return <Slot />;
};

export default DevLayout;
