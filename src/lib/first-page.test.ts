import {
  type InfiniteData,
  InfiniteQueryObserver,
  type QueryKey,
  QueryClient,
} from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { firstPageOnly, refetchFirstPage } from '@/lib/first-page';

type Page = { items: number[]; nextCursor: string | null };
type Data = InfiniteData<Page, string | null>;

const LAST_PAGE = 2;

function pageOf(cursor: string | null): Page {
  const index = cursor === null ? 0 : Number(cursor);
  return {
    items: [index],
    nextCursor: index < LAST_PAGE ? String(index + 1) : null,
  };
}

describe('firstPageOnly', () => {
  it('keeps page one and its param only', () => {
    const data: Data = {
      pages: [pageOf(null), pageOf('1'), pageOf('2')],
      pageParams: [null, '1', '2'],
    };

    expect(firstPageOnly(data)).toEqual({
      pages: [pageOf(null)],
      pageParams: [null],
    });
  });

  it('leaves a single page as it is', () => {
    const data: Data = { pages: [pageOf(null)], pageParams: [null] };

    expect(firstPageOnly(data)).toEqual(data);
  });
});

describe('refetchFirstPage', () => {
  // The archive's key holds its search: [..., { q, from, to }]
  const archiveKey: QueryKey = ['archive', { q: 'liverpool', from: 2004 }];
  const otherKey: QueryKey = ['archive', { q: 'milan', from: 2004 }];
  let queryClient: QueryClient;
  let unsubscribes: (() => void)[] = [];

  // As a screen: an observer loads page one, Show more the rest
  async function load(queryKey: QueryKey, pages: number) {
    const queryFn = vi.fn(async ({ pageParam }: { pageParam: string | null }) =>
      pageOf(pageParam),
    );
    const observer = new InfiniteQueryObserver(queryClient, {
      queryKey,
      queryFn,
      initialPageParam: null as string | null,
      getNextPageParam: (page: Page) => page.nextCursor,
    });
    unsubscribes.push(observer.subscribe(() => {}));
    await observer.refetch();
    for (let page = 1; page < pages; page += 1) {
      await observer.fetchNextPage();
    }
    queryFn.mockClear();
    return queryFn;
  }

  function startClient() {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  }

  afterEach(() => {
    unsubscribes.forEach((unsubscribe) => unsubscribe());
    unsubscribes = [];
    queryClient.clear();
  });

  it('fetches page one only, after Show more loaded three', async () => {
    startClient();
    const queryFn = await load(archiveKey, 3);

    await refetchFirstPage(queryClient, archiveKey);

    expect(queryFn).toHaveBeenCalledTimes(1);
    expect(queryFn.mock.calls[0][0].pageParam).toBeNull();
    expect(queryClient.getQueryData<Data>(archiveKey)).toEqual({
      pages: [pageOf(null)],
      pageParams: [null],
    });
  });

  it('keeps the cursor of page one, so Show more goes on', async () => {
    startClient();
    await load(archiveKey, 3);

    await refetchFirstPage(queryClient, archiveKey);

    const [page] = queryClient.getQueryData<Data>(archiveKey)?.pages ?? [];
    expect(page.nextCursor).toBe('1');
  });

  it('leaves another search alone', async () => {
    startClient();
    await load(archiveKey, 2);
    const otherFn = await load(otherKey, 2);

    await refetchFirstPage(queryClient, archiveKey);

    expect(otherFn).not.toHaveBeenCalled();
    expect(queryClient.getQueryData<Data>(otherKey)?.pages).toHaveLength(2);
  });

  it('does nothing when nothing is cached', async () => {
    startClient();

    await refetchFirstPage(queryClient, archiveKey);

    expect(queryClient.getQueryData(archiveKey)).toBeUndefined();
  });
});
