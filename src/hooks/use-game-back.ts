import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from 'expo-router';

// Android's Back asks on a game screen; it never leaves directly
export function useGameBack(onBack: () => void): void {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onBack();
          return true;
        },
      );
      return () => subscription.remove();
    }, [onBack]),
  );
}
