"use client";

import { useEffect, useRef, useState } from "react";

import type {
  AppToWebMessage,
  KeyboardStatePayload,
} from "@/shared/lib/bridge/types";

import { useKeyboardHeight } from "./useKeyboardHeight";

const STALE_MS = 5000;

type Result = {
  height: number;
  isOpen: boolean;
  source: "bridge" | "viewport" | "none";
};

const isKeyboardMessage = (
  data: unknown
): data is { type: "KEYBOARD_STATE"; payload: KeyboardStatePayload } => {
  if (typeof data !== "object" || data === null) return false;
  const m = data as Partial<AppToWebMessage>;
  if (m.type !== "KEYBOARD_STATE") return false;
  const p = m.payload as Partial<KeyboardStatePayload> | undefined;
  return (
    !!p &&
    p.v === 1 &&
    typeof p.height === "number" &&
    typeof p.state === "string"
  );
};

export const useKeyboardSource = (): Result => {
  const { keyboardHeight: vvHeight, isKeyboardOpen: vvOpen } =
    useKeyboardHeight();

  const [bridgeHeight, setBridgeHeight] = useState(0);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [hasBridgeEverFired, setHasBridgeEverFired] = useState(false);
  const [bridgeFresh, setBridgeFresh] = useState(false);
  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      let parsed: unknown;
      try {
        parsed =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (!isKeyboardMessage(parsed)) return;
      const { state, height } = parsed.payload;
      setHasBridgeEverFired(true);
      setBridgeFresh(true);
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
      staleTimerRef.current = setTimeout(() => {
        setBridgeFresh(false);
      }, STALE_MS);
      if (state === "will-hide" || state === "did-hide") {
        setBridgeHeight(0);
        setBridgeOpen(false);
      } else {
        setBridgeHeight(height);
        setBridgeOpen(height > 0);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (staleTimerRef.current) clearTimeout(staleTimerRef.current);
    };
  }, []);

  if (bridgeFresh) {
    return { height: bridgeHeight, isOpen: bridgeOpen, source: "bridge" };
  }
  if (vvOpen) {
    return { height: vvHeight, isOpen: vvOpen, source: "viewport" };
  }
  return {
    height: 0,
    isOpen: false,
    source: hasBridgeEverFired ? "viewport" : "none",
  };
};
