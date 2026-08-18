"use client";

import { useEffect, useState } from "react";

import { createMonthlyCookingRecordImage } from "../lib/createMonthlyCookingRecordImage";

type ImageGenerationResult = {
  key: string;
  blob: Blob | null;
  error: Error | null;
};

export type MonthlyCookingRecordImageStatus =
  | "idle"
  | "preparing"
  | "ready"
  | "error";

export const useMonthlyCookingRecordImage = ({
  enabled,
  generationKey,
}: {
  enabled: boolean;
  generationKey: string;
}) => {
  const [captureNode, setCaptureNode] = useState<HTMLDivElement | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);
  const requestKey = `${generationKey}:${retryVersion}`;

  useEffect(() => {
    if (!enabled || !captureNode) return;
    let isActive = true;

    void createMonthlyCookingRecordImage(captureNode)
      .then((blob) => {
        if (isActive) setResult({ key: requestKey, blob, error: null });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setResult({
          key: requestKey,
          blob: null,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      });

    return () => {
      isActive = false;
    };
  }, [captureNode, enabled, requestKey]);

  const isCurrentResult = result?.key === requestKey;
  const status: MonthlyCookingRecordImageStatus = !enabled
    ? "idle"
    : !captureNode || !isCurrentResult
      ? "preparing"
      : result.error
        ? "error"
        : "ready";

  return {
    captureRef: setCaptureNode,
    status,
    blob: status === "ready" ? (result?.blob ?? null) : null,
    error: status === "error" ? (result?.error ?? null) : null,
    retry: () => setRetryVersion((version) => version + 1),
  };
};
