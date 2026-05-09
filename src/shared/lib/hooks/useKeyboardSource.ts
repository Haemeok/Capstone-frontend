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
  const lastBridgeAtRef = useRef<number>(0);
  const [, forceTick] = useState(0);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      let parsed: unknown;
      try {
        parsed =
          typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data;
      } catch {
        return;
      }
      if (!isKeyboardMessage(parsed)) return;
      const { state, height } = parsed.payload;
      lastBridgeAtRef.current = Date.now();
      if (state === "will-hide" || state === "did-hide") {
        setBridgeHeight(0);
        setBridgeOpen(false);
      } else {
        setBridgeHeight(height);
        setBridgeOpen(height > 0);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (lastBridgeAtRef.current === 0) return;
      if (Date.now() - lastBridgeAtRef.current > STALE_MS) {
        forceTick((n) => n + 1);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const bridgeFresh =
    lastBridgeAtRef.current > 0 &&
    Date.now() - lastBridgeAtRef.current <= STALE_MS;

  if (bridgeFresh) {
    return { height: bridgeHeight, isOpen: bridgeOpen, source: "bridge" };
  }
  if (vvOpen) {
    return { height: vvHeight, isOpen: vvOpen, source: "viewport" };
  }
  return {
    height: 0,
    isOpen: false,
    source: lastBridgeAtRef.current > 0 ? "viewport" : "none",
  };
};
