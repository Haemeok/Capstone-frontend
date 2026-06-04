"use client";

import { useMemo } from "react";

import { getDxId } from "../auth/dxId";
import type { AuthDiagBridgePayload } from "./types";
import { useAppMessageListener } from "./useAppMessage";

const forwardRnPhase = async (payload: AuthDiagBridgePayload, dxId: string) => {
  try {
    await fetch("/api/auth/diag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, dxId }),
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    // feature flag off 시 404 — 무시
  }
};

const probeWebViewCookie = async (
  payload: AuthDiagBridgePayload,
  dxId: string
) => {
  try {
    const params = new URLSearchParams({
      phase: payload.phase,
      diagId: payload.diagId,
      source: "webview-post-rn-event",
      dxId,
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
        const dxId = getDxId();
        void forwardRnPhase(payload, dxId);
        void probeWebViewCookie(payload, dxId);
      },
    }),
    []
  );

  useAppMessageListener(handlers);
};
