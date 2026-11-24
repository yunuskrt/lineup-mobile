import React, { useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ContinueAsGuest from '@/components/auth/ContinueAsGuest';
import HomeFold from '@/components/home/HomeFold';
import HomeRules from '@/components/home/HomeRules';
import ShowcaseFrame from '@/components/home/ShowcaseFrame';
import OfflineNotice from '@/components/shell/OfflineNotice';
import { Button } from '@/components/ui/button';
import { useCatalogOverview } from '@/hooks/use-catalog-overview';
import { useIsOffline } from '@/hooks/use-is-offline';
import { type Box, isHalfInView } from '@/lib/demo-view';

const EDGE_GAP = 16;

type Props = {};

// First launch: what the game is, then a guest start or a sign-in
const Welcome = ({}: Props) => {
  const insets = useSafeAreaInsets();
  const overview = useCatalogOverview();
  const isOffline = useIsOffline();
  // Offline, the notice takes the top inset and the column starts under it
  const columnTop = (isOffline ? 0 : insets.top) + EDGE_GAP;
  const [isDemoInView, setIsDemoInView] = useState(false);
  // Layout numbers only; a scroll re-renders just when the answer flips
  const frame = useRef<Box>({ top: 0, height: 0 });
  const viewport = useRef({ scrollY: 0, height: 0 });

  function check() {
    const { scrollY, height } = viewport.current;
    setIsDemoInView(isHalfInView(frame.current, scrollY, height));
  }

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    viewport.current.scrollY = event.nativeEvent.contentOffset.y;
    check();
  }

  function onViewportLayout(event: LayoutChangeEvent) {
    viewport.current.height = event.nativeEvent.layout.height;
    check();
  }

  function onFrameLayout(event: LayoutChangeEvent) {
    const { y, height } = event.nativeEvent.layout;
    // Its y is inside the column, which starts below the top padding
    frame.current = { top: y + columnTop, height };
    check();
  }

  return (
    <View className="flex-1 bg-surface">
      {isOffline ? (
        <View
          // The top inset is known only at run time
          style={{ paddingTop: insets.top }}
        >
          <OfflineNotice />
        </View>
      ) : null}
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={100}
        onLayout={onViewportLayout}
        // The top inset is known only at run time
        contentContainerStyle={{ paddingTop: columnTop }}
      >
        <View className="gap-8 px-4 pb-6">
          <HomeFold />
          <View className="h-0.5 bg-line" />
          <HomeRules />
          <View className="h-0.5 bg-line" />
          <View onLayout={onFrameLayout}>
            <ShowcaseFrame
              showcase={overview.data?.showcase ?? null}
              isLoading={overview.isPending}
              isInView={isDemoInView}
            />
          </View>
        </View>
      </ScrollView>
      <View
        className="gap-3 border-t-2 border-line bg-surface px-4 pt-4"
        // The home indicator's inset is known only at run time
        style={{ paddingBottom: insets.bottom + EDGE_GAP }}
      >
        <ContinueAsGuest isPrimary onDone={() => router.replace('/play')} />
        <Button
          label="Sign in"
          variant="secondary"
          size="large"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    </View>
  );
};

export default Welcome;
