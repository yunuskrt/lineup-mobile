import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '@/components/shell/TabBar';
import { TABS } from '@/lib/tabs';

type Props = {};

const TabsLayout = ({}: Props) => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'none' }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.label }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;
