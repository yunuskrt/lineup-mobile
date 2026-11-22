import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import ToastChip from '@/components/game/feedback-toast/ToastChip';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { ToastMessage } from '@/types/feedback';

type Props = {
  toast: ToastMessage | null;
};

// A fixed slot, so nothing shifts as a verdict comes and goes
const FeedbackToast = ({ toast }: Props) => {
  // Faded text must not linger for screen readers
  const [endedId, setEndedId] = useState<number | null>(null);
  const id = toast?.id ?? null;
  const message = toast?.message ?? null;

  useEffect(() => {
    if (id === null || message === null) return;
    AccessibilityInfo.announceForAccessibility(message);
    const timer = setTimeout(
      () => setEndedId(id),
      MOTION_DURATION_MS.toastVisible,
    );
    return () => clearTimeout(timer);
  }, [id, message]);

  return (
    <View className="h-8 items-center justify-center">
      {toast && toast.id !== endedId ? (
        <ToastChip key={toast.id} message={toast.message} />
      ) : null}
    </View>
  );
};

export default FeedbackToast;
