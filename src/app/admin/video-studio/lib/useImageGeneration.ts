"use client";

import { useCallback, useRef, useState } from "react";

export type ImageGenState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "success"; imageDataUrls: string[]; latencyMs: number }
  | { status: "error"; message: string };

type RunInput = {
  modelId: string;
  prompt: string;
  n: number;
  referenceImageUrl?: string;
};

type RunResult = {
  images: string[];
  modelId: string;
  pricePerImage: number;
};

export const useImageGeneration = () => {
  const [state, setState] = useState<ImageGenState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (input: RunInput): Promise<RunResult | null> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setState({ status: "pending" });

      try {
        const res = await fetch("/api/admin/video-studio/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
          signal: controller.signal,
        });
        const data = (await res.json()) as
          | {
              images: string[];
              modelId: string;
              pricePerImage: number;
              latencyMs: number;
            }
          | { error: string };
        if (!res.ok || !("images" in data)) {
          setState({
            status: "error",
            message: "error" in data ? data.error : `HTTP ${res.status}`,
          });
          return null;
        }
        setState({
          status: "success",
          imageDataUrls: data.images,
          latencyMs: data.latencyMs,
        });
        return {
          images: data.images,
          modelId: data.modelId,
          pricePerImage: data.pricePerImage,
        };
      } catch (err) {
        if (controller.signal.aborted) {
          setState({ status: "idle" });
          return null;
        }
        setState({
          status: "error",
          message: err instanceof Error ? err.message : String(err),
        });
        return null;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState({ status: "idle" });
  }, []);

  return { state, run, cancel };
};
