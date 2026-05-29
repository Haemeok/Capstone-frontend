"use client";

import { useCallback, useState } from "react";

import { buildClayPrompt } from "./clayPrompt";
import {
  DEFAULT_MODEL_ID,
  type ItemsResult,
  type TipItem,
  type TopicCandidate,
} from "./schema";

const IMAGE_MODEL_ID = "gpt-image-2-low";

type Status = "idle" | "loading" | "error";

const postContent = async (body: Record<string, unknown>) => {
  const res = await fetch("/api/bff/admin/card-news-grid/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "content error");
  return res.json();
};

export const useGridCardNews = () => {
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [topics, setTopics] = useState<TopicCandidate[]>([]);
  const [header, setHeader] = useState("");
  const [items, setItems] = useState<TipItem[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const run = useCallback(async (fn: () => Promise<void>) => {
    setStatus("loading");
    setError(null);
    try {
      await fn();
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  const generateTopics = useCallback(
    (seedKeyword: string) =>
      run(async () => {
        const data = await postContent({ stage: "topics", modelId, seedKeyword });
        setTopics(data.topics);
      }),
    [modelId, run],
  );

  const generateItems = useCallback(
    (topicTitle: string) =>
      run(async () => {
        const data: ItemsResult = await postContent({ stage: "items", modelId, topicTitle });
        setHeader(data.header);
        setItems(data.items);
        setImageUrl(null);
      }),
    [modelId, run],
  );

  const generateImage = useCallback(
    () =>
      run(async () => {
        const prompt = buildClayPrompt(items.map((it) => it.dishName));
        const res = await fetch("/api/bff/admin/image-edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId: IMAGE_MODEL_ID, prompt, referenceImageUrls: [] }),
        });
        if (!res.ok) throw new Error((await res.json()).error ?? "image error");
        const data = await res.json();
        setImageUrl(data.imageUrl);
      }),
    [items, run],
  );

  const updateItem = useCallback((index: number, patch: Partial<TipItem>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }, []);

  return {
    modelId, setModelId,
    status, error,
    topics, header, setHeader, items, imageUrl,
    generateTopics, generateItems, generateImage, updateItem,
  };
};
