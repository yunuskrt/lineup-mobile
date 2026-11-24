import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { historyOutcomeLabel, historyTone } from '@/lib/profile';
import { cn } from '@/lib/utils';
import type { HistoryEntry } from '@/types/profile';
import type { HistoryTone } from '@/types/profile-screen';

const TONE_TEXT: Record<HistoryTone, string> = {
  win: 'text-you-text',
  loss: 'text-danger-text',
  draw: 'text-fg',
  clear: 'text-found-text',
  neutral: 'text-fg-muted',
};

type Props = { entry: HistoryEntry };

const Outcome = ({ entry }: Props) => {
  const tone = historyTone(entry);
  return (
    <View className="shrink-0 flex-row items-center gap-1.5">
      {/* A draw is shared, so it shows both colours */}
      {tone === 'draw' ? (
        <View className="h-3 flex-row overflow-hidden rounded-sm">
          <View className="w-1 bg-you" />
          <View className="w-1 bg-opponent" />
        </View>
      ) : null}
      <Text
        numberOfLines={1}
        className={cn('font-body-semibold text-14', TONE_TEXT[tone])}
      >
        {historyOutcomeLabel(entry)}
      </Text>
    </View>
  );
};

export default Outcome;
