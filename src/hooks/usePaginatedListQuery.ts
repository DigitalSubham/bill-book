import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedResponse } from '../types';
import { DEFAULT_PAGE_SIZE } from '../apis/pagination';

interface UsePaginatedListQueryOptions<T> {
  queryKey: readonly unknown[];
  queryFn: (params: { page: number; limit: number }) => Promise<PaginatedResponse<T>>;
  enabled?: boolean;
  staleTime?: number;
  pageSize?: number;
}

export const usePaginatedListQuery = <T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 0,
  pageSize = DEFAULT_PAGE_SIZE,
}: UsePaginatedListQueryOptions<T>) => {
  const query = useInfiniteQuery({
    queryKey: [...queryKey, pageSize],
    queryFn: ({ pageParam }) => queryFn({ page: pageParam, limit: pageSize }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime,
    enabled,
  });

  const items = query.data?.pages.flatMap(page => page.items) ?? [];
  const pagination = query.data?.pages.at(-1)?.meta;

  return {
    ...query,
    items,
    pagination,
  };
};
