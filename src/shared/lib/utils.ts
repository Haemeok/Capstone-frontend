import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { PageResponse } from "../api/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNextPageParam = <T>(lastPage: PageResponse<T>) => {
  if (lastPage.page.totalPages === 0) return null;
  return lastPage.page.number === lastPage.page.totalPages - 1
    ? null
    : lastPage.page.number + 1;
};

export const buildParams = <T extends object>(
  base: T,
  optionals: Partial<T>
): T => {
  const params = { ...base };
  (Object.keys(optionals) as Array<keyof T>).forEach((key) => {
    const value = optionals[key];
    if (value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
};

const buildSafeParams = <T extends object> (base: T, optionals: Partial<T>) => {
  const params = { ...base };
  for (const key in optionals) {
    if (optionals[key] !== null && optionals[key] !== undefined) {
      params[key] = optionals[key];
    }
  }
  return params;
};

