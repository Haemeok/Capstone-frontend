"use client";

import { useCallback, useRef, useState } from "react";

import { addGeneration } from "@/app/admin/image-quality-test/lib/costStorage";

export type VariantResult =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; imageUrl: string; cost: number; latencyMs: number }
  | { status: "error"; message: string; latencyMs: number };

export type ResultsByVariant = Record<string, VariantResult>;

type RunResponse = {
  modelId: string;
  imageUrl?: string;
  cost?: number;
  latencyMs: number;
  error?: string;
};

export type VariantRun = { variantId: string; prompt: string };

export const usePromptCompare = (modelId: string) => {
  const [results, setResults] = useState<ResultsByVariant>({});
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runOne = useCallback(
    async (variantId: string, prompt: string, signal: AbortSignal) => {
      setResults((prev) => ({ ...prev, [variantId]: { status: "pending" } }));
      try {
        const res = await fetch("/api/admin/image-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId, prompt }),
          signal,
        });
        const data = (await res.json()) as RunResponse;

        if (!res.ok || data.error || !data.imageUrl || data.cost === undefined) {
          setResults((prev) => ({
            ...prev,
            [variantId]: {
              status: "error",
              message: data.error ?? `HTTP ${res.status}`,
              latencyMs: data.latencyMs,
            },
          }));
          return;
        }

        addGeneration(modelId, data.cost);
        setResults((prev) => ({
          ...prev,
          [variantId]: {
            status: "success",
            imageUrl: data.imageUrl as string,
            cost: data.cost as number,
            latencyMs: data.latencyMs,
          },
        }));
      } catch (err) {
        if (signal.aborted) {
          setResults((prev) => ({ ...prev, [variantId]: { status: "idle" } }));
          return;
        }
        const message = err instanceof Error ? err.message : String(err);
        setResults((prev) => ({
          ...prev,
          [variantId]: { status: "error", message, latencyMs: 0 },
        }));
      }
    },
    [modelId]
  );

  const runAll = useCallback(
    async (runs: VariantRun[]) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const valid = runs.filter((r) => r.prompt.trim().length > 0);
      setRunning(true);
      setResults((prev) => {
        const next = { ...prev };
        for (const r of valid) next[r.variantId] = { status: "pending" };
        return next;
      });

      await Promise.allSettled(
        valid.map((r) => runOne(r.variantId, r.prompt, controller.signal))
      );
      setRunning(false);
    },
    [runOne]
  );

  const retry = useCallback(
    async (variantId: string, prompt: string) => {
      const controller = new AbortController();
      await runOne(variantId, prompt, controller.signal);
    },
    [runOne]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setRunning(false);
  }, []);

  return { results, running, runAll, retry, cancel };
};
