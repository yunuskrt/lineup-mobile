import React, { type ReactNode } from 'react';
import { Hammer } from 'lucide-react-native';
import Screen from '@/components/shell/Screen';
import StateNotice from '@/components/shell/StateNotice';

type Props = {
  title: string;
  // Which phase builds the real screen, e.g. "M13: the play setup"
  builtIn: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children?: ReactNode;
};

// A shell screen until its phase lands
const PlaceholderScreen = ({
  title,
  builtIn,
  canGoBack,
  hasTabBar,
  children,
}: Props) => {
  return (
    <Screen title={title} canGoBack={canGoBack} hasTabBar={hasTabBar}>
      <StateNotice tone="info" icon={Hammer} message={`Built in ${builtIn}.`} />
      {children}
    </Screen>
  );
};

export default PlaceholderScreen;
