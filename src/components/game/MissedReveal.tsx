import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { SUMMARY_SECTION } from '@/components/game/run-summary/styles';
import ProLockButton from '@/components/pro/ProLockButton';
import ProLockCaption from '@/components/pro/ProLockCaption';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { SoloSummary } from '@/types/solo';

const LABEL = 'Reveal the full XI';
const LOCK_CAPTION = 'Pro shows every player you missed.';

type Props = {
  summary: SoloSummary;
  isRevealed: boolean;
  onReveal: () => void;
};

const MissedReveal = ({ summary, isRevealed, onReveal }: Props) => {
  // A summary opened already revealed has nothing to announce
  const [wasRevealedOnMount] = useState(isRevealed);
  const line = `Showing the ${summary.missedCount} you missed.`;

  // The button is gone; say what took its place
  useEffect(() => {
    if (isRevealed && !wasRevealedOnMount) {
      AccessibilityInfo.announceForAccessibility(line);
    }
  }, [isRevealed, wasRevealedOnMount, line]);

  if (summary.missedCount === 0) return null;

  return (
    <View className={cn(SUMMARY_SECTION, 'mt-3 gap-3 border-t-2 border-line')}>
      {/* The server sends the list to Pro only */}
      {summary.missed === null ? (
        <>
          <ProLockButton label={LABEL} caption={LOCK_CAPTION} isFullWidth />
          <ProLockCaption caption={LOCK_CAPTION} />
        </>
      ) : isRevealed ? (
        // The button's height, so the section never shifts
        <View className="h-11 justify-center">
          <Text className="text-14 text-fg-muted">{line}</Text>
        </View>
      ) : (
        <Button label={LABEL} variant="secondary" onPress={onReveal} />
      )}
    </View>
  );
};

export default MissedReveal;
