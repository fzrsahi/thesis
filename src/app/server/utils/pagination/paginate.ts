import { PaginationMeta, PaginationParams, PaginatedResult } from "./pagination.types";

type CountAndFindArgs<TWhere, TSelect> = {
  where?: TWhere;
  select?: TSelect;
  orderBy?: unknown;
};

type PrismaLikeDelegate<TItem, TWhere, TSelect> = {
  count(args: { where?: TWhere }): Promise<number>;
  findMany(args: {
    where?: TWhere;
    select?: TSelect;
    orderBy?: unknown;
    skip?: number;
    take?: number;
  }): Promise<TItem[]>;
};

export const paginate = async <TItem, TWhere = unknown, TSelect = unknown>(
  delegate: PrismaLikeDelegate<TItem, TWhere, TSelect>,
  params: PaginationParams | null | undefined,
  args: CountAndFindArgs<TWhere, TSelect> = {}
): Promise<PaginatedResult<TItem>> => {
  const shouldPaginate = Boolean(params?.page && params?.limit);

  if (!shouldPaginate) {
    const [total, data] = await Promise.all([
      delegate.count({ where: args.where }),
      delegate.findMany({ where: args.where, select: args.select, orderBy: args.orderBy }),
    ]);

    const pagination: PaginationMeta = {
      total,
      page: 1,
      limit: total,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };

    return { data, pagination };
  }

  const page = Math.max(1, Number(params!.page));
  const limit = Math.max(1, Number(params!.limit));
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    delegate.count({ where: args.where }),
    delegate.findMany({
      where: args.where,
      select: args.select,
      orderBy: args.orderBy,
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pagination: PaginationMeta = {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return { data, pagination };
};
