import { type CSSProperties, useCallback } from "react";

const KEYBOARD_INSET_THRESHOLD = 150;
const RESTORED_VIEWPORT_TOLERANCE = 1;

export const useDrawerKeyboardRestore = (style?: CSSProperties) => {
  const height = style?.height;
  const bottom = style?.bottom;
  return useCallback(
    (node: HTMLDivElement | null) => {
      const viewport = window.visualViewport;
      if (
        !node ||
        !viewport ||
        node.dataset.vaulDrawerDirection !== "bottom" ||
        node.dataset.vaulSnapPoints === "true"
      )
        return;

      const initialHeight =
        typeof height === "number" ? `${height}px` : (height ?? "");
      const initialBottom =
        typeof bottom === "number" ? `${bottom}px` : (bottom ?? "");
      let hadKeyboardInset = false;
      let frame = 0;
      const restore = () => {
        if (
          !hadKeyboardInset ||
          viewport.scale !== 1 ||
          window.innerHeight - viewport.height > RESTORED_VIEWPORT_TOLERANCE
        )
          return;
        node.style.height = initialHeight;
        node.style.bottom = initialBottom;
        hadKeyboardInset = false;
      };
      const onResize = () => {
        if (viewport.scale !== 1) return;
        if (window.innerHeight - viewport.height > KEYBOARD_INSET_THRESHOLD) {
          hadKeyboardInset = true;
        }
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(restore);
      };
      viewport.addEventListener("resize", onResize);
      return () => {
        viewport.removeEventListener("resize", onResize);
        cancelAnimationFrame(frame);
      };
    },
    [height, bottom]
  );
};
