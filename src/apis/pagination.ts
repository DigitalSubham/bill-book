import axios from './axiosInstance';
import { PaginatedResponse, PaginationMeta, PaginationParams } from '../types';

const ARRAY_KEYS = [
  'items',
  'data',
  'results',
  'docs',
  'rows',
  'products',
  'customers',
  'invoices',
] as const;

export const DEFAULT_PAGE_SIZE = 20;

interface NormalizedPaginationParams {
  page: number;
  limit: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const pickItems = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of ARRAY_KEYS) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
};

const buildMeta = <T>(
  payload: unknown,
  params: NormalizedPaginationParams,
  itemCount: number,
): PaginationMeta => {
  if (!isRecord(payload)) {
    return {
      page: params.page,
      limit: params.limit,
      hasNextPage: itemCount === params.limit,
    };
  }

  const metaSource = isRecord(payload.pagination)
    ? payload.pagination
    : isRecord(payload.meta)
      ? payload.meta
      : payload;

  const page = toNumber(metaSource.page ?? metaSource.currentPage) ?? params.page;
  const limit =
    toNumber(metaSource.limit ?? metaSource.perPage ?? metaSource.pageSize) ??
    params.limit;
  const total =
    toNumber(metaSource.total ?? metaSource.totalItems ?? metaSource.count) ??
    undefined;
  const totalPages =
    toNumber(metaSource.totalPages ?? metaSource.pageCount) ??
    (total && limit ? Math.ceil(total / limit) : undefined);
  const nextPage = toNumber(metaSource.nextPage);
  const hasNextPage =
    typeof metaSource.hasNextPage === 'boolean'
      ? metaSource.hasNextPage
      : typeof nextPage === 'number'
        ? nextPage > page
        : typeof totalPages === 'number'
          ? page < totalPages
          : itemCount === limit;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
  };
};

export const normalizePaginatedResponse = <T>(
  payload: unknown,
  params: NormalizedPaginationParams,
): PaginatedResponse<T> => {
  const items = pickItems<T>(payload);

  return {
    items,
    meta: buildMeta(payload, params, items.length),
  };
};

export const fetchPaginatedList = async <T>(
  endpoint: string,
  params: PaginationParams = {},
): Promise<PaginatedResponse<T>> => {
  const resolvedParams: PaginationParams = {
    ...params,
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_PAGE_SIZE,
  };

  const response = await axios.get(endpoint, {
    params: resolvedParams,
  });

  return normalizePaginatedResponse<T>(response.data, {
    page: resolvedParams.page ?? 1,
    limit: resolvedParams.limit ?? DEFAULT_PAGE_SIZE,
  });
};
