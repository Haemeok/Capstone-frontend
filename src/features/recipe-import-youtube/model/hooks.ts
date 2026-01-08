"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getYoutubeMeta } from "./actions";
import { checkYoutubeDuplicate, triggerYoutubeImport } from "./api";
import {
  YoutubeDuplicateCheckResponse,
  YoutubeMeta,
  YoutubeImportResponse,
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

export const useYoutubeImport = () => {
  const queryClient = useQueryClient();

  return useMutation<YoutubeImportResponse, Error, string>({
    mutationFn: (url: string) => triggerYoutubeImport(url),
    onSuccess: (data) => {
      if ("recipeId" in data) {
        queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
        queryClient.invalidateQueries({ queryKey: ["user-recipes"] });
      }
    },
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
