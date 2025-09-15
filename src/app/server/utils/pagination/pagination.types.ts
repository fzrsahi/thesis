export type PaginationParams = {
  page?: number | null;
  limit?: number | null;
  keywords?: string | null;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedResult<TData> = {
  data: TData[];
  pagination: PaginationMeta;
};

// Note: Single source of truth for PaginationParams above. Remove duplicates.
