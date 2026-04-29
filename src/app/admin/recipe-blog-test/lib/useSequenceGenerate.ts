"use client";

import { useCallback, useRef, useState } from "react";

import { addGeneration } from "@/app/admin/image-quality-test/lib/costStorage";

import {
  SEQUENCE_MODEL_IDS,
  type SequenceImage,
  type SequenceModelId,
} from "./types";

type CellState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; imageUrl: string; cost: number; latencyMs: number }
  | { status: "error"; message: string; latencyMs: number };

export type SequenceResults = Record<
  string,
  Record<SequenceModelId, CellState>
>;

const CONCURRENCY = 4;

type RunResponse = {
  modelId: string;
  imageUrl?: string;
  cost?: number;
  latencyMs: number;
  error?: string;
};

const initialCells = (
  status: CellState["status"]
): Record<SequenceModelId, CellState> =>
  Object.fromEntries(
    SEQUENCE_MODEL_IDS.map((m) => [m, { status }])
  ) as Record<SequenceModelId, CellState>;

export const useSequenceGenerate = () => {
  const [results, setResults] = useState<SequenceResults>({});
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const setCell = useCallback(
    (imageId: string, modelId: SequenceModelId, state: CellState) => {
      setResults((prev) => ({
        ...prev,
        [imageId]: {
          ...(prev[imageId] ?? initialCells("idle")),
          [modelId]: state,
        },
      }));
    },
    []
  );

  const runOne = useCallback(
    async (
      imageId: string,
      modelId: SequenceModelId,
      prompt: string,
      signal: AbortSignal
    ) => {
      setCell(imageId, modelId, { status: "pending" });
      try {
        const res = await fetch("/api/admin/image-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId, prompt }),
          signal,
        });
        const data = (await res.json()) as RunResponse;
        if (!res.ok || data.error || !data.imageUrl || data.cost === undefined) {
          setCell(imageId, modelId, {
            status: "error",
            message: data.error ?? `HTTP ${res.status}`,
            latencyMs: data.latencyMs ?? 0,
          });
          return;
        }
        addGeneration(modelId, data.cost);
        setCell(imageId, modelId, {
          status: "success",
          imageUrl: data.imageUrl,
          cost: data.cost,
          latencyMs: data.latencyMs,
        });
      } catch (err) {
        if (signal.aborted) {
          setCell(imageId, modelId, { status: "idle" });
          return;
        }
        const message = err instanceof Error ? err.message : String(err);
        setCell(imageId, modelId, { status: "error", message, latencyMs: 0 });
      }
    },
    [setCell]
  );

  const runWithCap = useCallback(
    async <T,>(items: T[], worker: (item: T) => Promise<void>) => {
      const queue = items.slice();
      const workers: Promise<void>[] = [];
      for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(
          (async () => {
            while (queue.length > 0) {
              const next = queue.shift();
              if (!next) break;
              await worker(next);
            }
          })()
        );
      }
      await Promise.all(workers);
    },
    []
  );

  const generate = useCallback(
    async (sequence: SequenceImage[]) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const initial: SequenceResults = {};
      for (const s of sequence) initial[s.id] = initialCells("pending");
      setResults(initial);
      setRunning(true);

      const jobs = sequence.flatMap((s) =>
        SEQUENCE_MODEL_IDS.map((m) => ({
          id: s.id,
          modelId: m,
          prompt: s.prompt,
        }))
      );

      await runWithCap(jobs, ({ id, modelId, prompt }) =>
        runOne(id, modelId, prompt, controller.signal)
      );

      setRunning(false);
    },
    [runOne, runWithCap]
  );

  const retry = useCallback(
    async (image: SequenceImage, modelId: SequenceModelId) => {
      const controller = new AbortController();
      await runOne(image.id, modelId, image.prompt, controller.signal);
    },
    [runOne]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setRunning(false);
  }, []);

  return { results, running, generate, retry, cancel };
};
