import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';
import type { HistoryMoreState } from '@/types/profile-screen';

type Props = {
  more: HistoryMoreState;
  count: number;
  onShowMore: () => void;
  // What is listed, plural
  noun?: string;
};

// The paging footer; a pending Show more holds its place
const HistoryMore = ({ more, count, onShowMore, noun = 'games' }: Props) => {
  const isLoading = more === 'loading';
  const shownCount = useRef(count);

  // New rows land below the reader; a pull's shorter list says nothing
  useEffect(() => {
    if (count > shownCount.current) {
      AccessibilityInfo.announceForAccessibility(`Showing ${count} ${noun}`);
    }
    shownCount.current = count;
  }, [count, noun]);

  if (more === 'end') return null;

  return (
    <View className="gap-3">
      {more === 'failed' ? (
        <StateNotice
          tone="error"
          icon={TriangleAlert}
          message={`Couldn’t load more ${noun}.`}
          isCompact
        >
          <Button label="Try again" variant="secondary" onPress={onShowMore} />
        </StateNotice>
      ) : (
        <Button
          label={isLoading ? 'Loading…' : 'Show more'}
          variant="secondary"
          isBusy={isLoading}
          onPress={onShowMore}
        />
      )}
    </View>
  );
};

export default HistoryMore;
