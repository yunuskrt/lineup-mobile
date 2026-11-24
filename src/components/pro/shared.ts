import { router } from 'expo-router';

// Opened from a link with nothing behind it, Play is the way out
export function leavePro() {
  if (router.canGoBack()) router.back();
  else router.replace('/play');
}
