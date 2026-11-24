import {
  type InfiniteData,
  InfiniteQueryObserver,
  QueryClient,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { firstHistoryPage, refreshHistory } from '@/hooks/use-profile';
import { sampleHistory } from '@/lib/dev/samples';
import { HISTORY_QUERY_KEY } from '@/lib/query-keys';
import type { HistoryPage } from '@/types/profile';

type HistoryData = InfiniteData<HistoryPage, string | null>;

const ENTRIES = sampleHistory(Date.UTC(2026, 10, 24));

function pageOf(cursor: string | null): HistoryPage {
  const index = cursor === null ? 0 : Number(cursor);
  return {
    entries: [ENTRIES[index]],
    nextCursor: index + 1 < 3 ? String(index + 1) : null,
  };
}

describe('firstHistoryPage', () => {
  it('keeps page one and its param only', () => {
    const data: HistoryData = {
      pages: [pageOf(null), pageOf('1'), pageOf('2')],
      pageParams: [null, '1', '2'],
    };

    expect(firstHistoryPage(data)).toEqual({
      pages: [pageOf(null)],
      pageParams: [null],
    });
  });

  it('leaves a single page as it is', () => {
    const data: HistoryData = { pages: [pageOf(null)], pageParams: [null] };

    expect(firstHistoryPage(data)).toEqual(data);
  });
});

describe('refreshHistory', () => {
  const queryKey = [...HISTORY_QUERY_KEY, 'user-1'];
  const queryFn = vi.fn(async ({ pageParam }: { pageParam: string | null }) =>
    pageOf(pageParam),
  );
  let queryClient: QueryClient;

  let unsubscribe = () => {};

  // As the screen: an observer loads page one, Show more the rest
  async function loadPages(pages: number) {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const observer = new InfiniteQueryObserver(queryClient, {
      queryKey,
      queryFn,
      initialPageParam: null as string | null,
      getNextPageParam: (page: HistoryPage) => page.nextCursor,
    });
    unsubscribe = observer.subscribe(() => {});
    await observer.refetch();
    for (let page = 1; page < pages; page += 1) {
      await observer.fetchNextPage();
    }
    queryFn.mockClear();
  }

  afterEach(() => {
    unsubscribe();
    queryClient.clear();
  });

  it('refetches page one only after Show more loaded three', async () => {
    await loadPages(3);

    await refreshHistory(queryClient, 'user-1');

    expect(queryFn).toHaveBeenCalledTimes(1);
    expect(queryFn.mock.calls[0][0].pageParam).toBeNull();
    const data = queryClient.getQueryData<HistoryData>(queryKey);
    expect(data?.pages).toEqual([pageOf(null)]);
    expect(data?.pageParams).toEqual([null]);
  });

  it('leaves another user’s history alone', async () => {
    await loadPages(2);

    await refreshHistory(queryClient, 'user-2');

    expect(queryFn).not.toHaveBeenCalled();
    expect(queryClient.getQueryData<HistoryData>(queryKey)?.pages).toHaveLength(
      2,
    );
  });

  it('does nothing when no history is cached', async () => {
    queryClient = new QueryClient();

    await refreshHistory(queryClient, 'user-1');

    expect(queryClient.getQueryData(queryKey)).toBeUndefined();
  });
});
