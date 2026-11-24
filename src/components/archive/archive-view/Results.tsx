import React from 'react';
import { View } from 'react-native';
import { SearchX } from 'lucide-react-native';
import ArchiveRow from '@/components/archive/ArchiveRow';
import ArchiveSkeleton from '@/components/archive/ArchiveSkeleton';
import type { ArchiveViewProps } from '@/components/archive/ArchiveView';
import { ARCHIVE_LIST } from '@/components/archive/styles';
import HistoryMore from '@/components/profile/HistoryMore';
import RetryNotice from '@/components/shell/RetryNotice';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = Pick<
  ArchiveViewProps,
  | 'view'
  | 'clearLabel'
  | 'onClear'
  | 'onRetry'
  | 'onShowMore'
  | 'onPlay'
  | 'starting'
> & { isCompact: boolean };

const Results = ({
  view,
  clearLabel,
  onClear,
  onRetry,
  onShowMore,
  onPlay,
  starting,
  isCompact,
}: Props) => {
  switch (view.status) {
    case 'loading':
      return <ArchiveSkeleton isCompact={isCompact} />;
    case 'error':
      return (
        <RetryNotice message={view.errorMessage ?? ''} onRetry={onRetry} />
      );
    case 'empty':
      return (
        <StateNotice
          tone="empty"
          icon={SearchX}
          message="No match fits. Try fewer words or a wider filter."
        >
          <Button label={clearLabel} variant="secondary" onPress={onClear} />
        </StateNotice>
      );
    case 'list':
      return (
        <View className="gap-6">
          {/* A new search loads over the last results */}
          <View
            accessibilityLabel="Matches, newest first"
            accessibilityState={{ busy: view.isRefreshing }}
            className={cn(ARCHIVE_LIST, view.isRefreshing && 'opacity-60')}
          >
            {view.entries.map((match, index) => (
              <ArchiveRow
                key={match.id}
                match={match}
                onPlay={onPlay}
                starting={starting?.id === match.id ? starting.kind : null}
                isDisabled={starting !== null && starting.id !== match.id}
                isCompact={isCompact}
                isLast={index === view.entries.length - 1}
              />
            ))}
          </View>
          <HistoryMore
            more={view.more}
            count={view.entries.length}
            onShowMore={onShowMore}
            noun="matches"
          />
        </View>
      );
    case 'pending':
    case 'locked':
      return null;
  }
};

export default Results;
