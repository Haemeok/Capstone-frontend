"use client";

import { type ReactNode, useEffect } from "react";

import { useKeyboardSource } from "@/shared/lib/hooks/useKeyboardSource";
import { useKeyboardStore } from "@/shared/store/useKeyboardStore";

const isAndroidWebView =
  typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

export const KeyboardAwareProvider = ({ children }: { children: ReactNode }) => {
  const { height, isOpen, source } = useKeyboardSource();
  const setKeyboardState = useKeyboardStore((s) => s.setKeyboardState);

  useEffect(() => {
    if (!isAndroidWebView) return;
    setKeyboardState(height, isOpen, source);
    document.documentElement.style.setProperty(
      "--keyboard-height",
      `${height}px`
    );
  }, [height, isOpen, source, setKeyboardState]);

  return <>{children}</>;
};
