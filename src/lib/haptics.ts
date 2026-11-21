import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// The light press; a device without haptics just stays still
export function pressHaptic(): void {
  const haptic =
    Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key)
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  haptic.catch(() => {});
}
