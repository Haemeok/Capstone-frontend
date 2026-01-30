"use client";

import { useEffect, useState, useCallback, useRef } from "react";

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

  const updateViewportHeight = useCallback(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const now = performance.now();
    if (now - lastUpdateRef.current < DEBOUNCE_MS) {
      // 디바운스: 너무 빈번한 업데이트 방지
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => updateViewportHeight());
      return;
    }

    lastUpdateRef.current = now;

    const viewport = window.visualViewport;
    const viewportHeight = viewport.height;

    // iOS Safari에서는 offsetTop도 고려해야 함
    const offsetTop = viewport.offsetTop || 0;
    const effectiveHeight = viewportHeight - offsetTop;

    // 키보드 높이 계산
    const calculatedKeyboardHeight = Math.max(
      0,
      window.innerHeight - effectiveHeight
    );

    setVisualViewportHeight(effectiveHeight);
    setKeyboardHeight(calculatedKeyboardHeight);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    // 초기값 설정
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
