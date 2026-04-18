"use client";

import { useCallback, useRef, useState } from "react";

import { addGeneration } from "./costStorage";
import { getModelById } from "./models";

export type ModelResult =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; imageUrl: string; cost: number; latencyMs: number }
  | { status: "error"; message: string; latencyMs: number };

export type ResultsMap = Record<string, ModelResult>;

type RunResponse = {
  modelId: string;
  imageUrl?: string;
  cost?: number;
  latencyMs: number;
  error?: string;
};

export const useImageTest = () => {
  const [results, setResults] = useState<ResultsMap>({});
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runOne = useCallback(async (modelId: string, prompt: string, signal: AbortSignal) => {
    setResults((prev) => ({ ...prev, [modelId]: { status: "pending" } }));

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
          [modelId]: {
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
        [modelId]: {
          status: "success",
          imageUrl: data.imageUrl as string,
          cost: data.cost as number,
          latencyMs: data.latencyMs,
        },
      }));
    } catch (err) {
      if (signal.aborted) {
        setResults((prev) => ({ ...prev, [modelId]: { status: "idle" } }));
        return;
      }
      const message = err instanceof Error ? err.message : String(err);
      setResults((prev) => ({ ...prev, [modelId]: { status: "error", message, latencyMs: 0 } }));
    }
  }, []);

  const runAll = useCallback(
    async (modelIds: string[], prompt: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const validIds = modelIds.filter((id) => getModelById(id));
      setRunning(true);
      setResults(Object.fromEntries(validIds.map((id) => [id, { status: "pending" as const }])));

      await Promise.allSettled(validIds.map((id) => runOne(id, prompt, controller.signal)));
      setRunning(false);
    },
    [runOne]
  );

  const retry = useCallback(
    async (modelId: string, prompt: string) => {
      const controller = new AbortController();
      await runOne(modelId, prompt, controller.signal);
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
