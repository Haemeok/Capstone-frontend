"use client";

import { type ReactNode, useEffect } from "react";

import { useKeyboardSource } from "@/shared/lib/hooks/useKeyboardSource";
import { useKeyboardStore } from "@/shared/store/useKeyboardStore";

export const KeyboardAwareProvider = ({ children }: { children: ReactNode }) => {
  const { height, isOpen, source } = useKeyboardSource();
  const setKeyboardState = useKeyboardStore((s) => s.setKeyboardState);

  useEffect(() => {
    setKeyboardState(height, isOpen, source);
  }, [height, isOpen, source, setKeyboardState]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--keyboard-height",
      `${height}px`
    );
  }, [height]);

  return <>{children}</>;
};
