"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  SeedanceModelId,
  SeedanceRatio,
  SeedanceResolution,
  SeedanceTaskState,
} from "./types";

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

export type VideoGenState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "polling"; taskId: string; lastStatus: SeedanceTaskState["status"] }
  | { status: "success"; taskId: string; videoUrl: string }
  | { status: "error"; message: string };

type RunInput = {
  model: SeedanceModelId;
  prompt: string;
  imageDataUrlOrUrl?: string;
  resolution: SeedanceResolution;
  ratio: SeedanceRatio;
  durationSec: number;
  generateAudio: boolean;
};

export const useVideoGeneration = () => {
  const [state, setState] = useState<VideoGenState>({ status: "idle" });
  const stoppedRef = useRef(false);

  const run = useCallback(async (input: RunInput): Promise<boolean> => {
    stoppedRef.current = false;
    setState({ status: "submitting" });

    let taskId: string;
    try {
      const submitRes = await fetch("/api/bff/admin/video-studio/video/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const submitData = (await submitRes.json()) as {
        taskId?: string;
        error?: string;
      };
      if (!submitRes.ok || !submitData.taskId) {
        setState({
          status: "error",
          message: submitData.error ?? `HTTP ${submitRes.status}`,
        });
        return false;
      }
      taskId = submitData.taskId;
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
      return false;
    }

    setState({ status: "polling", taskId, lastStatus: "queued" });

    const startedAt = Date.now();
    while (!stoppedRef.current) {
      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        setState({ status: "error", message: "timeout (>10min)" });
        return false;
      }

      try {
        const r = await fetch(
          `/api/bff/admin/video-studio/video/status/${encodeURIComponent(taskId)}`
        );
        const t = (await r.json()) as SeedanceTaskState & { error?: string };

        if (stoppedRef.current) return false;

        if (!r.ok || !t.status) {
          setState({ status: "error", message: t.error ?? `HTTP ${r.status}` });
          return false;
        }
        if (t.status === "succeeded" && t.videoUrl) {
          setState({ status: "success", taskId, videoUrl: t.videoUrl });
          return true;
        }
        if (
          t.status === "failed" ||
          t.status === "cancelled" ||
          t.status === "expired"
        ) {
          setState({
            status: "error",
            message: t.errorMessage ?? `task ${t.status}`,
          });
          return false;
        }
        setState({ status: "polling", taskId, lastStatus: t.status });
      } catch (err) {
        if (stoppedRef.current) return false;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
        return false;
      }

      await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
    }
    return false;
  }, []);

  const cancel = useCallback(() => {
    stoppedRef.current = true;
    setState({ status: "idle" });
  }, []);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
    };
  }, []);

  return { state, run, cancel };
};
