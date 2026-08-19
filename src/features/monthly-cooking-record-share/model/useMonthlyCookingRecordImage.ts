"use client";

import { useEffect, useState } from "react";

import { captureAnalyticsEvent } from "@/shared/lib/analytics";
import { isAppWebView } from "@/shared/lib/bridge";

import { createMonthlyCookingRecordImage } from "../lib/createMonthlyCookingRecordImage";

type ImageGenerationResult = {
  key: string;
  blob: Blob | null;
  error: Error | null;
};

const CAPTURE_ERROR_PREFIX = "MONTHLY_COOKING_RECORD_";

const getCaptureErrorCode = (error: unknown): string => {
  if (!(error instanceof Error)) return "unknown";

  return error.message.startsWith(CAPTURE_ERROR_PREFIX)
    ? error.message
    : error.name;
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
      .then(({ blob, diagnostics }) => {
        if (!isActive) return;
        if (isAppWebView()) {
          captureAnalyticsEvent("monthly_share_capture_diagnostic", {
            captureVersion: 1,
            status: "completed",
            ...diagnostics,
          });
        }
        setResult({ key: requestKey, blob, error: null });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        if (isAppWebView()) {
          captureAnalyticsEvent("monthly_share_capture_diagnostic", {
            captureVersion: 1,
            status: "failed",
            errorCode: getCaptureErrorCode(error),
          });
        }
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
    captureTarget: captureNode,
    status,
    blob: status === "ready" ? (result?.blob ?? null) : null,
    error: status === "error" ? (result?.error ?? null) : null,
    retry: () => setRetryVersion((version) => version + 1),
  };
};
