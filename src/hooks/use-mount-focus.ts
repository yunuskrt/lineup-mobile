import { useEffect, useRef } from 'react';
import { AccessibilityInfo, type ViewInstance } from 'react-native';

// Long enough for the view to be on screen first
const FOCUS_DELAY_MS = 100;

// A screen reader lands on this view once it mounts
export function useMountFocus() {
  const ref = useRef<ViewInstance>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) {
        AccessibilityInfo.sendAccessibilityEvent(ref.current, 'focus');
      }
    }, FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return ref;
}
