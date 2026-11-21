import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '@/components/shell/screen/BackButton';
import { Text } from '@/components/ui/text';
import { headerCollapse } from '@/lib/screen-header';
import { TYPE_CARD_TITLE, TYPE_TITLE } from '@/styles/classes';

const BOTTOM_GAP = 32;

type Props = {
  title: string;
  children: ReactNode;
  // Pushed screens get a back chevron
  canGoBack?: boolean;
  // A control at the bar's right end, such as Quit
  headerAction?: ReactNode;
  // Tab screens leave the bottom edge to the tab bar
  hasTabBar?: boolean;
};

// A ruled column under a large title that collapses into a bar
const Screen = ({
  title,
  children,
  canGoBack = false,
  headerAction,
  hasTabBar = false,
}: Props) => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const titleHeight = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  const barStyle = useAnimatedStyle(() => ({
    opacity: headerCollapse(scrollY.value, titleHeight.value),
  }));
  const bottom = (hasTabBar ? 0 : insets.bottom) + BOTTOM_GAP;

  return (
    <View className="flex-1 bg-surface">
      <View
        className="bg-surface"
        // The top inset is known only at run time
        style={{ paddingTop: insets.top }}
      >
        <View className="h-11 flex-row items-center gap-2 px-2">
          {canGoBack ? <BackButton /> : <View className="w-2" />}
          <Animated.View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            className="flex-1"
            // A Reanimated style: the compact title fades in
            style={barStyle}
          >
            <Text numberOfLines={1} className={TYPE_CARD_TITLE}>
              {title}
            </Text>
          </Animated.View>
          {headerAction}
        </View>
        <Animated.View
          className="h-0.5 bg-line"
          // A Reanimated style: the rule fades in with the bar
          style={barStyle}
        />
      </View>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        // The bottom inset is known only at run time
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <View className="gap-6 px-4 pt-2">
          <View
            onLayout={(event) =>
              titleHeight.set(event.nativeEvent.layout.height)
            }
          >
            <Text accessibilityRole="header" className={TYPE_TITLE}>
              {title}
            </Text>
          </View>
          {children}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default Screen;
