import React, { useEffect, useState } from 'react';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/global.css';
import QueryProvider from '@/components/providers/QueryProvider';
import { loadToken } from '@/lib/api/http/token-store';
import { registerApiClient } from '@/lib/api/register';
import { ROLES } from '@/styles/tokens';

registerApiClient();
// The splash holds until the saved session token is read
SplashScreen.preventAutoHideAsync().catch(() => {});

// Navigator colours: cream behind every screen, never a white flash
const THEME = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: ROLES.surface,
    card: ROLES.surface,
    text: ROLES.fg,
    border: ROLES.line,
    primary: ROLES.brand,
  },
};

type Props = {};

const RootLayout = ({}: Props) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadToken().finally(() => {
      setIsReady(true);
      SplashScreen.hideAsync().catch(() => {});
    });
  }, []);

  if (!isReady) return null;

  return (
    // NativeWind can't style the gesture root
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ThemeProvider value={THEME}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            {/* A swipe here would pop the whole run */}
            <Stack.Screen name="(game)" options={{ gestureEnabled: false }} />
          </Stack>
        </ThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
