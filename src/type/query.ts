export type BaseQueryParams = {
  page: number;
  size: number;
  sort: string;
  search?: string;
};

export type PageResponse<T> = {
  content: T[];

  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
