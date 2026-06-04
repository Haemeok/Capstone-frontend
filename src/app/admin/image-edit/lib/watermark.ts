import type { CSSProperties } from "react";

import { toBlob } from "html-to-image";

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
  /** glass 백킹의 어두운 베이스 알파 (0 = 완전 투명, 블랙끼 없음) */
  tint: number;
  /** 블러 반경 = logoPx * blur (0 = 블러 없음, 유리 패널만) */
  blur: number;
};

export const DEFAULT_SETTINGS: WatermarkSettings = {
  position: "bottom-center",
  scale: 0.85,
  paddingPct: 2,
  opacity: 1,
  tint: 0,
  blur: 0.21,
};

export type LoadedImage = { url: string; width: number; height: number };

/** 선택한 9방향 + 여백(px)을 배지 래퍼의 절대배치 스타일로 변환 */
export const positionToStyle = (
  position: WatermarkPosition,
  paddingPx: number
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

/** 풀캔버스 사진 사본을 positionToStyle 미러로 배치 — 측정 없이 뒤 사진과 픽셀 정렬 */
export const backdropCopyStyle = (
  position: WatermarkPosition,
  paddingPx: number,
  naturalWidth: number,
  naturalHeight: number
): CSSProperties => {
  const [vertical, horizontal] = position.split("-");
  const style: CSSProperties = {
    position: "absolute",
    width: naturalWidth,
    height: naturalHeight,
    objectFit: "cover",
  };
  const transforms: string[] = [];

  if (vertical === "top") style.top = -paddingPx;
  else if (vertical === "bottom") style.bottom = -paddingPx;
  else {
    style.top = "50%";
    transforms.push("translateY(-50%)");
  }

  if (horizontal === "left") style.left = -paddingPx;
  else if (horizontal === "right") style.right = -paddingPx;
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
    reader.onerror = () =>
      reject(reader.error ?? new Error("FileReader error"));
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
  fileName: string
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
