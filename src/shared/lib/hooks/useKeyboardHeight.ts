"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseKeyboardHeightReturn = {
  keyboardHeight: number;
  isKeyboardOpen: boolean;
  visualViewportHeight: number;
};

const KEYBOARD_THRESHOLD = 150; // 키보드로 간주할 최소 높이 차이 (px)
const DEBOUNCE_MS = 16; // 약 1프레임 (60fps)

export const useKeyboardHeight = (): UseKeyboardHeightReturn => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [visualViewportHeight, setVisualViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const updateViewportHeightRef = useRef<() => void>(() => {});

  const updateViewportHeight = useCallback(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const now = performance.now();
    if (now - lastUpdateRef.current < DEBOUNCE_MS) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() =>
        updateViewportHeightRef.current()
      );
      return;
    }

    lastUpdateRef.current = now;

    const viewport = window.visualViewport;
    const offsetTop = viewport.offsetTop || 0;
    const visibleBottom = offsetTop + viewport.height;
    const calculatedKeyboardHeight = Math.max(
      0,
      window.innerHeight - visibleBottom
    );

    setVisualViewportHeight(viewport.height);
    setKeyboardHeight(calculatedKeyboardHeight);
  }, []);

  useEffect(() => {
    updateViewportHeightRef.current = updateViewportHeight;
  }, [updateViewportHeight]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- deferred to #124
    updateViewportHeight();

    const viewport = window.visualViewport;

    // resize 이벤트 핸들러 (키보드 열림/닫힘)
    const handleResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateViewportHeight);
    };

    // scroll 이벤트 핸들러 (iOS Safari에서 뷰포트 이동 시)
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateViewportHeight);
    };

    viewport.addEventListener("resize", handleResize);
    viewport.addEventListener("scroll", handleScroll);

    return () => {
      viewport.removeEventListener("resize", handleResize);
      viewport.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateViewportHeight]);

  const isKeyboardOpen = keyboardHeight > KEYBOARD_THRESHOLD;

  return {
    keyboardHeight,
    isKeyboardOpen,
    visualViewportHeight,
  };
};
