"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { addGeneration } from "@/app/admin/image-quality-test/lib/costStorage";

export type ImageEditQuality = "low" | "medium" | "high";

export const QUALITY_TO_MODEL_ID: Record<ImageEditQuality, string> = {
  low: "gpt-image-2-low",
  medium: "gpt-image-2-medium",
  high: "gpt-image-2-high",
};

export type RunCell =
  | { status: "idle" }
  | { status: "running" }
  | {
      status: "success";
      imageUrl: string;
      cost: number;
      latencyMs: number;
      completedAt: number;
    }
  | { status: "error"; message: string };

export type Results = Partial<Record<ImageEditQuality, RunCell>>;

type SubmitInput = {
  qualities: readonly ImageEditQuality[];
  prompt: string;
  referenceImageUrls: readonly string[];
};

const runOne = async (
  quality: ImageEditQuality,
  prompt: string,
  referenceImageUrls: readonly string[],
  signal: AbortSignal
): Promise<RunCell> => {
  try {
    const res = await fetch("/api/bff/admin/image-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelId: QUALITY_TO_MODEL_ID[quality],
        prompt,
        referenceImageUrls,
      }),
      signal,
    });
    const data = (await res.json()) as {
      imageUrl?: string;
      pricePerImage?: number;
      latencyMs?: number;
      error?: string;
    };
    if (!res.ok || !data.imageUrl) {
      throw new Error(data.error ?? `HTTP ${res.status}`);
    }
    return {
      status: "success",
      imageUrl: data.imageUrl,
      cost: data.pricePerImage ?? 0,
      latencyMs: data.latencyMs ?? 0,
      completedAt: Date.now(),
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { status: "idle" };
    }
    const message = err instanceof Error ? err.message : String(err);
    return { status: "error", message };
  }
};

export const useImageEdit = () => {
  const [results, setResults] = useState<Results>({});
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const submit = useCallback(
    async ({ qualities, prompt, referenceImageUrls }: SubmitInput) => {
      if (qualities.length === 0) return;
      if (referenceImageUrls.length === 0) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setResults((prev) => {
        const next: Results = { ...prev };
        for (const q of qualities) next[q] = { status: "running" };
        return next;
      });
      setRunning(true);

      await Promise.all(
        qualities.map(async (q) => {
          const cell = await runOne(
            q,
            prompt,
            referenceImageUrls,
            controller.signal
          );
          if (controller.signal.aborted) return;
          if (cell.status === "success") {
            addGeneration(QUALITY_TO_MODEL_ID[q], cell.cost);
          }
          setResults((prev) => ({ ...prev, [q]: cell }));
        })
      );

      if (!controller.signal.aborted) setRunning(false);
    },
    []
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setResults((prev) => {
      const next: Results = {};
      for (const key of Object.keys(prev) as ImageEditQuality[]) {
        const cell = prev[key];
        if (!cell) continue;
        next[key] = cell.status === "running" ? { status: "idle" } : cell;
      }
      return next;
    });
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    setResults({});
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { results, running, submit, cancel, reset };
};
