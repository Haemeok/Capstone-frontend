import { type RefObject, useCallback, useLayoutEffect, useRef } from "react";

import { isAppWebView } from "@/shared/lib/bridge/client";

import { startScrollDiagnostics } from "./startScrollDiagnostics";

export const useScrollDiagnostics = (
  containerRef: RefObject<HTMLDivElement | null>,
  pathname: string
) => {
  const recorder = useRef<ReturnType<typeof startScrollDiagnostics> | null>(
    null
  );
  useLayoutEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const container = containerRef.current;
    if (
      !isAppWebView() ||
      !isIOS ||
      !container ||
      document.visibilityState === "hidden"
    )
      return;
    recorder.current = startScrollDiagnostics(container, pathname);
    return () => {
      recorder.current?.stop("cleanup");
      recorder.current = null;
    };
  }, [containerRef, pathname]);
  return useCallback((reason: "route_restore" | "input_restore") => {
    recorder.current?.record(reason);
  }, []);
};
