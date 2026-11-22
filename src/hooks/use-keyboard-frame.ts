import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent, Platform } from 'react-native';

export type KeyboardFrame = {
  isShown: boolean;
  // From the screen's bottom edge, so it covers the home indicator
  height: number;
};

const HIDDEN: KeyboardFrame = { isShown: false, height: 0 };

// iOS warns before the keyboard moves, so the band moves with it
const SHOW_EVENT =
  Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const HIDE_EVENT =
  Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

function currentFrame(): KeyboardFrame {
  const metrics = Keyboard.metrics();
  if (!Keyboard.isVisible() || !metrics) return HIDDEN;
  return { isShown: true, height: metrics.height };
}

// The keyboard's state; edge to edge, Android's window never resizes for it
export function useKeyboardFrame(): KeyboardFrame {
  const [frame, setFrame] = useState(currentFrame);

  useEffect(() => {
    const show = Keyboard.addListener(SHOW_EVENT, (event: KeyboardEvent) =>
      setFrame({ isShown: true, height: event.endCoordinates.height }),
    );
    const hide = Keyboard.addListener(HIDE_EVENT, () => setFrame(HIDDEN));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return frame;
}
