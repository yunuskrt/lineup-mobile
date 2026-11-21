import React from 'react';
import { View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { LayoutGrid, type LucideIcon, Play, User } from 'lucide-react-native';
import TabButton from '@/components/shell/tab-bar/TabButton';
import { TABS } from '@/lib/tabs';
import type { TabName } from '@/types/navigation';

const TAB_ICON: Record<TabName, LucideIcon> = {
  play: Play,
  archive: LayoutGrid,
  profile: User,
};

type Props = BottomTabBarProps;

// The sticker tab bar: cream, an ink rule on top, a lavender pill
const TabBar = ({ state, emitter, navigateToTab, insets }: Props) => {
  return (
    <View
      accessibilityRole="tablist"
      className="border-t-2 border-line bg-surface"
      // The bottom inset is known only at run time
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="h-14 flex-row">
        {state.routes.map((route, index) => {
          const tab = TABS.find((item) => item.name === route.name);
          if (!tab) return null;
          const isActive = index === state.index;
          const press = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isActive && !event.defaultPrevented) navigateToTab(route.key);
          };
          return (
            <TabButton
              key={route.key}
              label={tab.label}
              icon={TAB_ICON[tab.name]}
              isActive={isActive}
              onPress={press}
            />
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
