import { toBlob } from "html-to-image";

import type { CSSProperties } from "react";

export type WatermarkPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export const WATERMARK_POSITIONS: readonly WatermarkPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "middle-left",
  "middle-center",
  "middle-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export type WatermarkSettings = {
  position: WatermarkPosition;
  scale: number;
  paddingPct: number;
  opacity: number;
};

export const DEFAULT_SETTINGS: WatermarkSettings = {
  position: "bottom-center",
  scale: 1,
  paddingPct: 3,
  opacity: 1,
};

export type LoadedImage = { url: string; width: number; height: number };

/** 선택한 9방향 + 여백(px)을 배지 래퍼의 절대배치 스타일로 변환 */
export const positionToStyle = (
  position: WatermarkPosition,
  paddingPx: number,
): CSSProperties => {
  const [vertical, horizontal] = position.split("-");
  const style: CSSProperties = { position: "absolute" };
  const transforms: string[] = [];

  if (vertical === "top") style.top = paddingPx;
  else if (vertical === "bottom") style.bottom = paddingPx;
  else {
    style.top = "50%";
    transforms.push("translateY(-50%)");
  }

  if (horizontal === "left") style.left = paddingPx;
  else if (horizontal === "right") style.right = paddingPx;
  else {
    style.left = "50%";
    transforms.push("translateX(-50%)");
  }

  if (transforms.length > 0) style.transform = transforms.join(" ");
  return style;
};

/** File → data URL + natural 크기 */
export const readImage = (file: File): Promise<LoadedImage> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
    reader.onload = () => {
      const url = reader.result;
      if (typeof url !== "string") {
        reject(new Error("FileReader returned non-string"));
        return;
      }
      const img = new Image();
      img.onload = () =>
        resolve({ url, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("image decode error"));
      img.src = url;
    };
    reader.readAsDataURL(file);
  });

/** 캡처 노드를 native 해상도 PNG로 다운로드 */
export const exportWatermarked = async (
  node: HTMLElement,
  fileName: string,
): Promise<void> => {
  await document.fonts.ready;
  const blob = await toBlob(node, {
    pixelRatio: 1,
    cacheBust: true,
    skipAutoScale: true,
  });
  if (!blob) throw new Error("toBlob returned null");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
