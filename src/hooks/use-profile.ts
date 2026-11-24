import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery,
  type QueryClient,
  useQueryClient,
} from '@tanstack/react-query';
import { useSession } from '@/hooks/use-auth';
import { getApiClient } from '@/lib/api';
import { DEFAULT_HISTORY_LIMIT } from '@/lib/api/schemas/profile';
import { unwrap } from '@/lib/api/unwrap';
import { HISTORY_QUERY_KEY, PROFILE_QUERY_KEY } from '@/lib/query-keys';
import type { HistoryPage } from '@/types/profile';

type HistoryData = InfiniteData<HistoryPage, string | null>;

// Keyed by user, so a new identity never sees old numbers
function useUserId(): string | null {
  return useSession().data?.user.id ?? null;
}

export function useProfile() {
  const userId = useUserId();
  return useQuery({
    queryKey: [...PROFILE_QUERY_KEY, userId],
    queryFn: async () => unwrap(await getApiClient().profile.getProfile()),
    enabled: userId !== null,
  });
}

export function useHistory() {
  const userId = useUserId();
  return useInfiniteQuery({
    queryKey: [...HISTORY_QUERY_KEY, userId],
    queryFn: async ({ pageParam }) =>
      unwrap(
        await getApiClient().profile.getHistory({
          cursor: pageParam,
          limit: DEFAULT_HISTORY_LIMIT,
        }),
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor,
    enabled: userId !== null,
  });
}

// Keeps page one only, so a refetch fetches just that
export function firstHistoryPage(data: HistoryData): HistoryData {
  return {
    pages: data.pages.slice(0, 1),
    pageParams: data.pageParams.slice(0, 1),
  };
}

// A pull starts the list over from the newest page
export async function refreshHistory(
  queryClient: QueryClient,
  userId: string | null,
): Promise<void> {
  const queryKey = [...HISTORY_QUERY_KEY, userId];
  queryClient.setQueryData<HistoryData>(
    queryKey,
    (data) => data && firstHistoryPage(data),
  );
  await queryClient.refetchQueries({ queryKey, exact: true });
}

export function useRefreshHistory() {
  const userId = useUserId();
  const queryClient = useQueryClient();
  return () => refreshHistory(queryClient, userId);
}
