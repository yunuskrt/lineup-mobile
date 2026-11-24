import type {
  InfiniteData,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';

// Keeps page one only, so a refetch fetches just that
export function firstPageOnly<TPage, TParam>(
  data: InfiniteData<TPage, TParam>,
): InfiniteData<TPage, TParam> {
  return {
    pages: data.pages.slice(0, 1),
    pageParams: data.pageParams.slice(0, 1),
  };
}

// A pull starts a paged list over from its newest page
export async function refetchFirstPage(
  queryClient: QueryClient,
  queryKey: QueryKey,
): Promise<void> {
  queryClient.setQueryData<InfiniteData<unknown, unknown>>(
    queryKey,
    (data) => data && firstPageOnly(data),
  );
  await queryClient.refetchQueries({ queryKey, exact: true });
}
