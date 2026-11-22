import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  AudioManager,
  AudioContext as NativeAudioContext,
} from 'react-native-audio-api';
import { registerAudioRuntime } from '@/lib/sound/engine';
import { configureSoundStorage } from '@/lib/sound/preference';

let isRegistered = false;

// The native pieces behind the copied engine and mute store
export function registerSound(): void {
  if (isRegistered) return;
  isRegistered = true;

  // Synchronous, as the mute choice is read on render
  configureSoundStorage({
    getItem: (key) => SecureStore.getItem(key),
    setItem: (key, value) => SecureStore.setItem(key, value),
  });

  registerAudioRuntime({
    // The library mirrors Web Audio; its classes aren't the DOM's types
    createContext: () => new NativeAudioContext() as unknown as AudioContext,
    // iOS heeds the silent switch; music plays on, as on Android
    prepareSession: () =>
      AudioManager.setSystemOptions({
        ios: {
          category: 'ambient',
          options: ['mixWithOthers'],
          allowHaptics: true,
        },
      }),
    onForeground: (listener) => {
      AppState.addEventListener('change', (state) => {
        if (state === 'active') listener();
      });
    },
  });
}
