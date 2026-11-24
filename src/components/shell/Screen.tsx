import React, { type ReactNode, useEffect } from 'react';
import { KeyboardAvoidingView, RefreshControl, View } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '@/components/shell/screen/BackButton';
import OfflineNotice from '@/components/shell/OfflineNotice';
import { Text } from '@/components/ui/text';
import { headerCollapse } from '@/lib/screen-header';
import { cn } from '@/lib/utils';
import { TYPE_CARD_TITLE, TYPE_TITLE } from '@/styles/classes';
import { ROLES } from '@/styles/tokens';

const BOTTOM_GAP = 32;
// Without a title, the rule fades in over the gap above the column
const TOP_GAP = 16;
const FOOTER_GAP = 12;

type Props = {
  // Only the auth screens keep a large title
  title?: string;
  children: ReactNode;
  // Pushed screens get a back chevron
  canGoBack?: boolean;
  // The chevron's own action, such as a step back
  onBack?: () => void;
  // A control at the bar's right end, such as Quit
  headerAction?: ReactNode;
  // Tab screens leave the bottom edge to the tab bar
  hasTabBar?: boolean;
  // Forms: the column rises above the keyboard, taps still land
  avoidsKeyboard?: boolean;
  // A change scrolls the column back to the top
  scrollResetKey?: string;
  // Pull to refresh, with the spinner in ink
  onRefresh?: () => void;
  isRefreshing?: boolean;
  // A row pinned under the scroll, clear of the home indicator
  footer?: ReactNode;
};

// A ruled column; a large title, where there is one, becomes a bar
const Screen = ({
  title,
  children,
  canGoBack = false,
  onBack,
  headerAction,
  hasTabBar = false,
  avoidsKeyboard = false,
  scrollResetKey,
  onRefresh,
  isRefreshing = false,
  footer,
}: Props) => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const titleHeight = useSharedValue(title ? 0 : TOP_GAP);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [scrollRef, scrollResetKey]);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });
  const barStyle = useAnimatedStyle(() => ({
    opacity: headerCollapse(scrollY.value, titleHeight.value),
  }));
  const inset = hasTabBar ? 0 : insets.bottom;
  // A footer takes the inset; the scroll keeps its own gap
  const bottom = (footer ? 0 : inset) + BOTTOM_GAP;
  const hasRow = canGoBack || headerAction !== undefined || title !== undefined;

  return (
    <View className="flex-1 bg-surface">
      <View
        className="bg-surface"
        // The top inset is known only at run time
        style={{ paddingTop: insets.top }}
      >
        {hasRow ? (
          <View className="h-11 flex-row items-center gap-2 px-2">
            {canGoBack ? (
              <BackButton onPress={onBack} />
            ) : (
              <View className="w-2" />
            )}
            {title ? (
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
            ) : (
              <View className="flex-1" />
            )}
            {headerAction}
          </View>
        ) : null}
        <Animated.View
          className="h-0.5 bg-line"
          // A Reanimated style: the rule fades in with the bar
          style={barStyle}
        />
      </View>
      <OfflineNotice />
      <KeyboardAvoidingView
        behavior={avoidsKeyboard ? 'padding' : undefined}
        enabled={avoidsKeyboard}
        className="flex-1"
      >
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={ROLES.fg}
                colors={[ROLES.fg]}
                progressBackgroundColor={ROLES['surface-card']}
              />
            ) : undefined
          }
          // The bottom inset is known only at run time
          contentContainerStyle={{ paddingBottom: bottom }}
        >
          <View className={cn('gap-6 px-4', title ? 'pt-2' : 'pt-4')}>
            {title ? (
              <View
                onLayout={(event) =>
                  titleHeight.set(event.nativeEvent.layout.height)
                }
              >
                <Text accessibilityRole="header" className={TYPE_TITLE}>
                  {title}
                </Text>
              </View>
            ) : null}
            {children}
          </View>
        </Animated.ScrollView>
        {footer ? (
          <View
            className="border-t-2 border-line bg-surface px-4 pt-3"
            // The home indicator's inset is known only at run time
            style={{ paddingBottom: inset + FOOTER_GAP }}
          >
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Screen;
