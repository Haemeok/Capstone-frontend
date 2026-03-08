"use client";

import { useQuery } from "@tanstack/react-query";

import { getYoutubeMeta } from "./actions";
import { checkYoutubeDuplicate } from "./api";
import {
  YoutubeDuplicateCheckResponse,
  YoutubeMeta,
} from "./types";

export const useYoutubeMeta = (url: string | null) => {
  return useQuery<YoutubeMeta | null>({
    queryKey: ["youtube-meta", url],
    queryFn: () => {
      if (!url) return Promise.resolve(null);
      return getYoutubeMeta(url);
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};

export const useYoutubeDuplicateCheck = (url: string | null) => {
  return useQuery<YoutubeDuplicateCheckResponse>({
    queryKey: ["youtube-duplicate-check", url],
    queryFn: () => {
      if (!url) return Promise.resolve({});
      return checkYoutubeDuplicate(url);
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
