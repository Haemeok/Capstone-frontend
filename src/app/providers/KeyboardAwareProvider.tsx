"use client";

import { type ReactNode, useEffect } from "react";

import { useKeyboardSource } from "@/shared/lib/hooks/useKeyboardSource";
import { useKeyboardStore } from "@/shared/store/useKeyboardStore";

// iOS WKWebView는 visualViewport를 자동 축소해 sticky bottom 요소를 키보드 위로
// 띄운다. 거기에 native bridge 높이까지 더하면 더블 패딩이 발생하므로 Android에
// 한해 보정한다. UA는 페이지 수명 동안 불변이라 모듈 레벨 상수로 평가한다.
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
