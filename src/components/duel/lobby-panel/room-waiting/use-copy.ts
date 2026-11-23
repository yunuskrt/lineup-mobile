import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const COPIED_MS = 2_000;

// "Copied" in place for a moment; a refused clipboard says so
export function useCopy() {
  const [isCopied, setIsCopied] = useState(false);
  const [isRefused, setIsRefused] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [isCopied]);

  async function copy(text: string) {
    try {
      const isSet = await Clipboard.setStringAsync(text);
      setIsRefused(!isSet);
      setIsCopied(isSet);
      if (isSet) AccessibilityInfo.announceForAccessibility('Code copied.');
    } catch {
      setIsRefused(true);
      setIsCopied(false);
    }
  }

  return { isCopied, isRefused, copy };
}
