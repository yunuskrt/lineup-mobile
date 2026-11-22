import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from 'expo-router';

// Android's Back steps back inside a screen; null lets it leave
export function useStepBack(onBack: (() => void) | null): void {
  useFocusEffect(
    useCallback(() => {
      if (!onBack) return;
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
