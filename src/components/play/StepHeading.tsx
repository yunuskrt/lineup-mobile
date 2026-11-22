import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, View, type ViewInstance } from 'react-native';
import { Text } from '@/components/ui/text';
import { TYPE_SECTION } from '@/styles/classes';

// Long enough for the new step to be on screen first
const FOCUS_DELAY_MS = 100;

type Props = {
  title: string;
  // After a step change, never on first load, as the web
  isFocusedOnMount: boolean;
};

const StepHeading = ({ title, isFocusedOnMount }: Props) => {
  const ref = useRef<ViewInstance>(null);
  // Read once: a later change, as Next is pressed, isn't a mount
  const [shouldFocus] = useState(isFocusedOnMount);

  useEffect(() => {
    if (!shouldFocus) return;
    const timer = setTimeout(() => {
      if (ref.current) {
        AccessibilityInfo.sendAccessibilityEvent(ref.current, 'focus');
      }
    }, FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shouldFocus]);

  return (
    <View ref={ref} accessible accessibilityRole="header">
      <Text className={TYPE_SECTION}>{title}</Text>
    </View>
  );
};

export default StepHeading;
