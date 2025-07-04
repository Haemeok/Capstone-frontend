import { PresignedUrlInfo } from "../types";

export type BaseQueryParams = {
  page: number;
  size: number;
  sort: string;
  q?: string;
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

export type PresignedUrlResponse = {
  uploads: PresignedUrlInfo[];
  recipeId: number;
};
