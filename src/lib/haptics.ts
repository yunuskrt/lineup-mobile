import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { CUE_HAPTICS } from '@/lib/cue-haptics';
import type { CueHapticKind } from '@/types/haptics';
import type { SoundCue } from '@/types/sound';

const { AndroidHaptics, ImpactFeedbackStyle, NotificationFeedbackType } =
  Haptics;

const ANDROID_EFFECTS: Record<CueHapticKind, Haptics.AndroidHaptics> = {
  success: AndroidHaptics.Confirm,
  warning: AndroidHaptics.Long_Press,
  error: AndroidHaptics.Reject,
  light: AndroidHaptics.Keyboard_Tap,
  medium: AndroidHaptics.Context_Click,
};

function iosFeedback(kind: CueHapticKind): Promise<void> {
  switch (kind) {
    case 'success':
      return Haptics.notificationAsync(NotificationFeedbackType.Success);
    case 'warning':
      return Haptics.notificationAsync(NotificationFeedbackType.Warning);
    case 'error':
      return Haptics.notificationAsync(NotificationFeedbackType.Error);
    case 'light':
      return Haptics.impactAsync(ImpactFeedbackStyle.Light);
    case 'medium':
      return Haptics.impactAsync(ImpactFeedbackStyle.Medium);
  }
}

// The light press; a device without haptics just stays still
export function pressHaptic(): void {
  const haptic =
    Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(AndroidHaptics.Virtual_Key)
      : Haptics.impactAsync(ImpactFeedbackStyle.Light);
  haptic.catch(() => {});
}

// Doubles a cue; the phone's own haptics setting has the last word
export function cueHaptic(cue: SoundCue): void {
  const kind = CUE_HAPTICS[cue];
  if (kind === null) return;
  const haptic =
    Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(ANDROID_EFFECTS[kind])
      : iosFeedback(kind);
  haptic.catch(() => {});
}
