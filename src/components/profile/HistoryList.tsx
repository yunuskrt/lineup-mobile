import React from 'react';
import { View } from 'react-native';
import EmptyHistory from '@/components/profile/history-list/EmptyHistory';
import HistoryMore from '@/components/profile/HistoryMore';
import HistoryRow from '@/components/profile/HistoryRow';
import { HISTORY_LIST, PROFILE_SECTION } from '@/components/profile/styles';
import { Text } from '@/components/ui/text';
import { useToday } from '@/hooks/use-today';
import { TYPE_SECTION } from '@/styles/classes';
import type { HistoryEntry } from '@/types/profile';
import type { HistoryMoreState } from '@/types/profile-screen';

type Props = {
  history: HistoryEntry[];
  more: HistoryMoreState;
  onShowMore: () => void;
};

const HistoryList = ({ history, more, onShowMore }: Props) => {
  const today = useToday();
  return (
    <View className={PROFILE_SECTION}>
      <Text accessibilityRole="header" className={TYPE_SECTION}>
        History
      </Text>
      {history.length === 0 ? (
        <EmptyHistory />
      ) : (
        <>
          <View className={HISTORY_LIST}>
            {history.map((entry, index) => (
              <HistoryRow
                key={entry.id}
                entry={entry}
                today={today}
                isLast={index === history.length - 1}
              />
            ))}
          </View>
          <HistoryMore
            more={more}
            count={history.length}
            onShowMore={onShowMore}
          />
        </>
      )}
    </View>
  );
};

export default HistoryList;
