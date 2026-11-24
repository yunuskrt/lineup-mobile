import React, { useEffect, useEffectEvent, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type Href, router, useLocalSearchParams } from 'expo-router';
import ArchiveView from '@/components/archive/ArchiveView';
import QuitDialog from '@/components/game/QuitDialog';
import { ARCHIVE_QUERY_KEY, useArchive } from '@/hooks/use-archive';
import { useFilterOptions } from '@/hooks/use-filter-options';
import { useProAccess } from '@/hooks/use-pro';
import { useStartNavigation } from '@/hooks/use-start-navigation';
import {
  ARCHIVE_SEARCH_DELAY_MS,
  archiveParams,
  archiveQueryOf,
  archiveSearchFrom,
  archiveSearchText,
  archiveView,
  pickedMatchPath,
  withOneClub,
} from '@/lib/archive';
import { authErrorMessageOf } from '@/lib/auth';
import { filtersFromParams } from '@/lib/filters';
import { refetchFirstPage } from '@/lib/first-page';
import { hasOpenRun, PRACTICE_OVER_RUN_COPY } from '@/lib/practice';
import { isStaleCursor } from '@/lib/profile';
import { routeParamsFor, searchParamsOf } from '@/lib/route-params';
import type { Filters } from '@/types/filters';
import type { MatchIdentity } from '@/types/match';
import type { RouteParams } from '@/types/route-params';

type Props = {};

const ArchiveScreen = ({}: Props) => {
  const routeParams = useLocalSearchParams<RouteParams>();
  // Read once; the screen keeps the params in step after
  const [params] = useState(() => searchParamsOf(routeParams));
  const queryClient = useQueryClient();
  const access = useProAccess();
  const options = useFilterOptions();
  const [search, setSearch] = useState(() => archiveSearchFrom(params));
  const [q, setQ] = useState(search);
  const [edited, setEdited] = useState<Filters | null>(null);
  const { go, isBusy: isStarting, error: startError } = useStartNavigation();
  const [picked, setPicked] = useState<{
    id: string;
    kind: 'play' | 'practice';
  } | null>(null);
  // A practice start held by the open-run warning
  const [warnedMatch, setWarnedMatch] = useState<MatchIdentity | null>(null);
  // Only a pull shows the spinner, never a refetch on focus
  const [isPulling, setIsPulling] = useState(false);

  const filters =
    edited ?? (options.data ? filtersFromParams(params, options.data) : null);
  // Locked or still loading: no request at all
  const query =
    access === 'open' && filters ? archiveQueryOf(q, filters) : null;
  const archive = useArchive(query);

  const view = archiveView({
    access,
    options: {
      isError: options.isError,
      error: options.error,
      hasData: options.data !== undefined,
    },
    pages: archive.data?.pages,
    isError: archive.isError,
    error: archive.error,
    isPlaceholderData: archive.isPlaceholderData,
    isFetchingNextPage: archive.isFetchingNextPage,
    isFetchNextPageError: archive.isFetchNextPageError,
    hasNextPage: archive.hasNextPage,
  });

  function apply(nextQ: string, nextFilters: Filters | null = filters) {
    setQ(nextQ);
    if (nextFilters && options.data) {
      const next = archiveParams(nextQ, nextFilters, options.data);
      router.setParams(routeParamsFor(next, routeParams));
    }
  }

  const applyTyped = useEffectEvent((next: string) => apply(next));

  // Searches once typing stops; the search key goes at once
  useEffect(() => {
    const next = archiveSearchText(search);
    if (next === q) return;
    const timer = setTimeout(() => applyTyped(next), ARCHIVE_SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search, q]);

  function changeFilters(next: Filters) {
    if (!filters) return;
    const one = withOneClub(filters, next);
    setEdited(one);
    apply(q, one);
  }

  function clear() {
    if (q) {
      setSearch('');
      apply('');
      return;
    }
    if (!options.data) return;
    const all = filtersFromParams(new URLSearchParams(), options.data);
    setEdited(all);
    apply('', all);
  }

  function retry() {
    if (options.isError && !options.data) void options.refetch();
    else void archive.refetch();
  }

  function showMore() {
    if (archive.isFetchingNextPage) return;
    // A page link the server forgot: start over
    if (archive.isFetchNextPageError && isStaleCursor(archive.error)) {
      void archive.refetch();
      return;
    }
    void archive.fetchNextPage();
  }

  async function refresh() {
    setIsPulling(true);
    if (options.isError && !options.data) await options.refetch();
    else await refetchFirstPage(queryClient, [...ARCHIVE_QUERY_KEY, query]);
    setIsPulling(false);
  }

  async function start(match: MatchIdentity, practice: boolean) {
    setPicked({ id: match.id, kind: practice ? 'practice' : 'play' });
    const href = pickedMatchPath(match.id, practice) as Href;
    if (!(await go(href))) setPicked(null);
    setWarnedMatch(null);
  }

  function play(match: MatchIdentity, practice: boolean) {
    if (practice && hasOpenRun()) setWarnedMatch(match);
    else void start(match, practice);
  }

  return (
    <>
      <ArchiveView
        view={view}
        search={search}
        filterState={
          filters && options.data ? { options: options.data, filters } : null
        }
        clearLabel={q ? 'Clear search' : 'Clear filters'}
        onSearchChange={setSearch}
        onSearchSubmit={() => apply(archiveSearchText(search))}
        onFiltersChange={changeFilters}
        onClear={clear}
        onRetry={retry}
        onShowMore={showMore}
        onPlay={play}
        starting={isStarting ? picked : null}
        playError={
          startError && !isStarting ? authErrorMessageOf(startError) : null
        }
        onRefresh={() => void refresh()}
        isRefreshing={isPulling}
      />
      {warnedMatch ? (
        <QuitDialog
          isOpen
          isQuitting={isStarting}
          copy={PRACTICE_OVER_RUN_COPY}
          onDismiss={() => setWarnedMatch(null)}
          onConfirm={() => void start(warnedMatch, true)}
        />
      ) : null}
    </>
  );
};

export default ArchiveScreen;
