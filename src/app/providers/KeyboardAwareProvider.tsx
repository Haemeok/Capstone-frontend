"use client";

import { type ReactNode, useEffect } from "react";

import { useKeyboardHeight } from "@/shared/lib/hooks/useKeyboardHeight";
import { useKeyboardStore } from "@/shared/store/useKeyboardStore";

export const KeyboardAwareProvider = ({ children }: { children: ReactNode }) => {
  const { keyboardHeight, isKeyboardOpen } = useKeyboardHeight();
  const setKeyboardState = useKeyboardStore((state) => state.setKeyboardState);

  // Zustand 스토어에 키보드 상태 동기화
  useEffect(() => {
    setKeyboardState(keyboardHeight, isKeyboardOpen);
  }, [keyboardHeight, isKeyboardOpen, setKeyboardState]);

  // CSS 변수로 키보드 높이 주입
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--keyboard-height",
        `${keyboardHeight}px`
      );
    }
  }, [keyboardHeight]);

  return <>{children}</>;
};
