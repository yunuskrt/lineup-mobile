import React from 'react';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '@/global.css';
import { ROLES } from '@/styles/tokens';

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
  return (
    // NativeWind can't style the gesture root
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={THEME}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          {/* A swipe here would pop the whole run */}
          <Stack.Screen name="(game)" options={{ gestureEnabled: false }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
