import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';
import { onlineManager } from '@tanstack/react-query';

// One announcement per drop, however many screens show the notice
let isAnnounced = false;
onlineManager.subscribe((isOnline) => {
  if (isOnline) isAnnounced = false;
});

export function announceOfflineOnce(line: string): void {
  if (isAnnounced) return;
  isAnnounced = true;
  AccessibilityInfo.announceForAccessibility(line);
}

// Query's own signal, fed from NetInfo: the notice and paused queries agree
export function useIsOffline(): boolean {
  const isOnline = useSyncExternalStore(
    (onChange) => onlineManager.subscribe(onChange),
    () => onlineManager.isOnline(),
  );
  return !isOnline;
}
