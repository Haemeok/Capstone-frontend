"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { getQueueSnapshot } from "@/app/actions/getQueueSnapshot";

const POLL_MS = 5_000;

export const BLOG_QUEUE_SNAPSHOT_QUERY_KEY = [
  "admin",
  "blog-queue-snapshot",
] as const;

export const usePendingCurationSlugs = () => {
  const { data, isLoading } = useQuery({
    queryKey: BLOG_QUEUE_SNAPSHOT_QUERY_KEY,
    queryFn: () => getQueueSnapshot(),
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
  });

  const slugs = useMemo(() => {
    const out = new Set<string>();
    for (const p of data?.pending ?? []) {
      if (p.slug) out.add(p.slug);
    }
    return out;
  }, [data]);

  return { slugs, isLoading };
};
