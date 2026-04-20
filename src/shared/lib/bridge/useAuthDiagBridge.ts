"use client";

import { useMemo } from "react";

import { useAppMessageListener } from "./useAppMessage";
import type { AuthDiagBridgePayload } from "./types";

const forwardRnPhase = async (payload: AuthDiagBridgePayload) => {
  try {
    await fetch("/api/auth/diag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    // feature flag off 시 404 — 무시
  }
};

const probeWebViewCookie = async (payload: AuthDiagBridgePayload) => {
  try {
    const params = new URLSearchParams({
      phase: payload.phase,
      diagId: payload.diagId,
      source: "webview-post-rn-event",
    });
    await fetch(`/api/auth/debug-cookie?${params.toString()}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    // 무시
  }
};

export const useAuthDiagBridge = () => {
  const handlers = useMemo(
    () => ({
      AUTH_DIAG: (payload: AuthDiagBridgePayload) => {
        void forwardRnPhase(payload);
        void probeWebViewCookie(payload);
      },
    }),
    []
  );

  useAppMessageListener(handlers);
};
