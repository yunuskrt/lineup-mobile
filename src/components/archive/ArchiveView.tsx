import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Search, TriangleAlert } from 'lucide-react-native';
import ArchiveFilters, {
  type ArchiveFilterState,
} from '@/components/archive/ArchiveFilters';
import ArchiveSkeleton from '@/components/archive/ArchiveSkeleton';
import Header from '@/components/archive/archive-view/Header';
import Locked from '@/components/archive/archive-view/Locked';
import Results from '@/components/archive/archive-view/Results';
import { ARCHIVE_SECTION } from '@/components/archive/styles';
import Screen from '@/components/shell/Screen';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ARCHIVE_SEARCH_MAX } from '@/lib/api/schemas/catalog';
import { isShortScreen } from '@/lib/welcome';
import { ROLES } from '@/styles/tokens';
import type { ArchiveView as ArchiveViewModel } from '@/types/archive';
import type { Filters } from '@/types/filters';
import type { MatchIdentity } from '@/types/match';

export type ArchiveViewProps = {
  view: ArchiveViewModel;
  search: string;
  filterState: ArchiveFilterState | null;
  // Clear search, or Clear filters with no search
  clearLabel: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: () => void;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
  onRetry: () => void;
  onShowMore: () => void;
  onPlay: (match: MatchIdentity, practice: boolean) => void;
  // The row whose run is being started, and how
  starting: { id: string; kind: 'play' | 'practice' } | null;
  // Making the guest for a run failed
  playError?: string | null;
  // Previews have no server to refresh from
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

type Props = ArchiveViewProps;

const ArchiveView = ({
  view,
  search,
  filterState,
  clearLabel,
  onSearchChange,
  onSearchSubmit,
  onFiltersChange,
  onClear,
  onRetry,
  onShowMore,
  onPlay,
  starting,
  playError = null,
  onRefresh,
  isRefreshing,
}: Props) => {
  const isCompact = isShortScreen(useWindowDimensions().height);
  const canRefresh =
    view.status === 'list' ||
    view.status === 'empty' ||
    view.status === 'error';

  return (
    <Screen
      hasTabBar
      onRefresh={canRefresh ? onRefresh : undefined}
      isRefreshing={isRefreshing}
    >
      <Header view={view} />
      {/* No controls until the lock is known: no flash */}
      {view.status === 'pending' ? (
        <View className={ARCHIVE_SECTION}>
          <ArchiveSkeleton isCompact={isCompact} />
        </View>
      ) : view.status === 'locked' ? (
        <View className={ARCHIVE_SECTION}>
          <Locked />
        </View>
      ) : (
        <>
          <View className={ARCHIVE_SECTION}>
            <View>
              <View className="pointer-events-none absolute bottom-0 left-3.5 top-0 z-10 justify-center">
                <Search
                  size={20}
                  strokeWidth={2.25}
                  color={ROLES['fg-muted']}
                />
              </View>
              <Input
                value={search}
                onChangeText={onSearchChange}
                onSubmitEditing={onSearchSubmit}
                placeholder="Search the archive"
                accessibilityLabel="Search the archive"
                maxLength={ARCHIVE_SEARCH_MAX}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                className="pl-11"
              />
            </View>
            <ArchiveFilters state={filterState} onChange={onFiltersChange} />
          </View>
          <View className={ARCHIVE_SECTION}>
            {playError ? (
              <Alert tone="warning" icon={TriangleAlert}>
                {playError}
              </Alert>
            ) : null}
            <Results
              view={view}
              clearLabel={clearLabel}
              onClear={onClear}
              onRetry={onRetry}
              onShowMore={onShowMore}
              onPlay={onPlay}
              starting={starting}
              isCompact={isCompact}
            />
          </View>
        </>
      )}
    </Screen>
  );
};

export default ArchiveView;
