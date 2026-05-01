"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

type RunOutcome = { imageUrl?: string };

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
  const resultsRef = useRef<SequenceResults>({});

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

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
      referenceImageUrl: string | undefined,
      signal: AbortSignal
    ): Promise<RunOutcome> => {
      setCell(imageId, modelId, { status: "pending" });
      try {
        const res = await fetch("/api/admin/image-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelId, prompt, referenceImageUrl }),
          signal,
        });
        const data = (await res.json()) as RunResponse;
        if (!res.ok || data.error || !data.imageUrl || data.cost === undefined) {
          setCell(imageId, modelId, {
            status: "error",
            message: data.error ?? `HTTP ${res.status}`,
            latencyMs: data.latencyMs ?? 0,
          });
          return {};
        }
        addGeneration(modelId, data.cost);
        setCell(imageId, modelId, {
          status: "success",
          imageUrl: data.imageUrl,
          cost: data.cost,
          latencyMs: data.latencyMs,
        });
        return { imageUrl: data.imageUrl };
      } catch (err) {
        if (signal.aborted) {
          setCell(imageId, modelId, { status: "idle" });
          return {};
        }
        const message = err instanceof Error ? err.message : String(err);
        setCell(imageId, modelId, { status: "error", message, latencyMs: 0 });
        return {};
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

      const doneUrls = new Map<string, string>();
      const cellKey = (id: string, modelId: SequenceModelId) =>
        `${id}__${modelId}`;

      const remaining = new Set(sequence.map((s) => s.id));
      const byId = new Map(sequence.map((s) => [s.id, s]));

      while (remaining.size > 0 && !controller.signal.aborted) {
        const ready: SequenceImage[] = [];
        for (const id of remaining) {
          const s = byId.get(id)!;
          if (!s.requiresReference) {
            ready.push(s);
            continue;
          }
          const refId = s.referenceFromImageId;
          if (!refId) continue;
          const allRefsDone = SEQUENCE_MODEL_IDS.every((m) =>
            doneUrls.has(cellKey(refId, m))
          );
          const refStillRunning = remaining.has(refId);
          if (allRefsDone && !refStillRunning) ready.push(s);
        }

        if (ready.length === 0) {
          for (const id of remaining) {
            const s = byId.get(id)!;
            for (const m of SEQUENCE_MODEL_IDS) {
              setCell(s.id, m, {
                status: "error",
                message: "참조 이미지 생성 실패로 건너뜀",
                latencyMs: 0,
              });
            }
          }
          break;
        }

        type WaveJob = {
          id: string;
          modelId: SequenceModelId;
          prompt: string;
          refImageUrl: string | undefined;
        };
        const jobs: WaveJob[] = [];
        for (const s of ready) {
          for (const m of SEQUENCE_MODEL_IDS) {
            const refUrl = s.requiresReference
              ? doneUrls.get(cellKey(s.referenceFromImageId!, m))
              : undefined;
            if (s.requiresReference && !refUrl) {
              setCell(s.id, m, {
                status: "error",
                message: "참조 이미지가 준비되지 않았습니다",
                latencyMs: 0,
              });
              continue;
            }
            jobs.push({ id: s.id, modelId: m, prompt: s.prompt, refImageUrl: refUrl });
          }
        }

        await runWithCap(jobs, async ({ id, modelId, prompt, refImageUrl }) => {
          const out = await runOne(id, modelId, prompt, refImageUrl, controller.signal);
          if (out.imageUrl) doneUrls.set(cellKey(id, modelId), out.imageUrl);
        });

        for (const s of ready) remaining.delete(s.id);
      }

      setRunning(false);
    },
    [runOne, runWithCap, setCell]
  );

  const retry = useCallback(
    async (image: SequenceImage, modelId: SequenceModelId) => {
      const controller = new AbortController();
      let referenceImageUrl: string | undefined;
      if (image.requiresReference) {
        const refSourceId = image.referenceFromImageId;
        const refCell = refSourceId
          ? resultsRef.current[refSourceId]?.[modelId]
          : undefined;
        if (refCell?.status === "success") {
          referenceImageUrl = refCell.imageUrl;
        } else {
          setCell(image.id, modelId, {
            status: "error",
            message: "참조 이미지가 준비되지 않았습니다",
            latencyMs: 0,
          });
          return;
        }
      }
      await runOne(image.id, modelId, image.prompt, referenceImageUrl, controller.signal);
    },
    [runOne, setCell]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setRunning(false);
  }, []);

  return { results, running, generate, retry, cancel };
};
