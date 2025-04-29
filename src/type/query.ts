export type BaseQueryParams = {
  page: number;
  size: number;
  sort: string;
  search?: string;
};

export type PageResponse<T> = {
  content: T[];

  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;

  numberOfElements: number;
  first: boolean;
  empty: boolean;
  size: number;

  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
};
