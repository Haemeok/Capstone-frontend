"use client";

import { type ReactNode, useEffect } from "react";

import { useKeyboardSource } from "@/shared/lib/hooks/useKeyboardSource";
import { useKeyboardStore } from "@/shared/store/useKeyboardStore";

const isAndroidWebView = () =>
  typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

export const KeyboardAwareProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { height, isOpen, source } = useKeyboardSource();
  const setKeyboardState = useKeyboardStore((s) => s.setKeyboardState);

  useEffect(() => {
    if (!isAndroidWebView()) return;
    setKeyboardState(height, isOpen, source);
    document.documentElement.style.setProperty(
      "--keyboard-height",
      `${height}px`
    );
    const activeElement = document.activeElement;
    const isTextInput =
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      (activeElement instanceof HTMLElement && activeElement.isContentEditable);
    if (!isOpen || !isTextInput) return;
    const frameId = window.requestAnimationFrame(() => {
      activeElement.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [height, isOpen, source, setKeyboardState]);

  return <>{children}</>;
};
