"use client";

import { useCallback, useRef, useState } from "react";

import { buildClayPrompt } from "./clayPrompt";
import {
  type CardMode,
  DEFAULT_MODEL_ID,
  type ItemsResult,
  type TipItem,
  type TopicCandidate,
} from "./schema";

const IMAGE_MODEL_ID = "gpt-image-2-low";

type Status = "idle" | "loading" | "error";

const readError = async (res: Response, fallback: string): Promise<string> => {
  const body = await res.json().catch(() => null);
  return body?.error ?? `${fallback} (${res.status})`;
};

const postContent = async (body: Record<string, unknown>) => {
  const res = await fetch("/api/bff/admin/card-news-grid/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readError(res, "content error"));
  return res.json();
};

export const useGridCardNews = () => {
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [mode, setMode] = useState<CardMode>("recipe");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [topics, setTopics] = useState<TopicCandidate[]>([]);
  const [header, setHeader] = useState("");
  const [items, setItems] = useState<TipItem[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const reqIdRef = useRef(0);

  const run = useCallback(
    async (fn: (isStale: () => boolean) => Promise<void>) => {
      const myId = ++reqIdRef.current;
      const isStale = () => myId !== reqIdRef.current;
      setStatus("loading");
      setError(null);
      try {
        await fn(isStale);
        if (!isStale()) setStatus("idle");
      } catch (e) {
        if (!isStale()) {
          setError(e instanceof Error ? e.message : String(e));
          setStatus("error");
        }
      }
    },
    []
  );

  const generateTopics = useCallback(
    (seedKeyword: string) =>
      run(async (isStale) => {
        const data = await postContent({
          stage: "topics",
          modelId,
          mode,
          seedKeyword,
        });
        if (isStale()) return;
        setTopics(data.topics);
      }),
    [modelId, mode, run]
  );

  const generateItems = useCallback(
    (topicTitle: string) =>
      run(async (isStale) => {
        const data: ItemsResult = await postContent({
          stage: "items",
          modelId,
          mode,
          topicTitle,
        });
        if (isStale()) return;
        setHeader(data.header);
        setItems(data.items);
        setImageUrl(null);
      }),
    [modelId, mode, run]
  );

  const generateImage = useCallback(
    () =>
      run(async (isStale) => {
        const prompt = buildClayPrompt(
          items.map((it) => it.imagePrompt),
          mode
        );
        const res = await fetch("/api/bff/admin/image-edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            modelId: IMAGE_MODEL_ID,
            prompt,
            referenceImageUrls: [],
          }),
        });
        if (!res.ok) throw new Error(await readError(res, "image error"));
        const data = await res.json();
        if (isStale()) return;
        setImageUrl(data.imageUrl);
      }),
    [items, mode, run]
  );

  const updateItem = useCallback((index: number, patch: Partial<TipItem>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    );
  }, []);

  return {
    modelId,
    setModelId,
    mode,
    setMode,
    status,
    error,
    topics,
    header,
    setHeader,
    items,
    imageUrl,
    generateTopics,
    generateItems,
    generateImage,
    updateItem,
  };
};
