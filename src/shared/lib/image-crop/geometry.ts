import type { CSSProperties } from "react";

export type PhotoCrop = {
  centerX: number;
  centerY: number;
  zoom: number;
};

export type ImageSize = {
  width: number;
  height: number;
};

export type CropPoint = {
  x: number;
  y: number;
};

export type CropViewportSize = {
  width: number;
  height: number;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const SQUARE_VIEWPORT: CropViewportSize = { width: 1, height: 1 };

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

const finiteOr = (value: number, fallback: number): number =>
  Number.isFinite(value) ? value : fallback;

const getSafeImageSize = (size: ImageSize): ImageSize => ({
  width: size.width > 0 ? size.width : 1,
  height: size.height > 0 ? size.height : 1,
});

const getSafeViewportSize = (
  viewportSize: CropViewportSize
): CropViewportSize => ({
  width: viewportSize.width > 0 ? viewportSize.width : 1,
  height: viewportSize.height > 0 ? viewportSize.height : 1,
});

const getCoverDisplaySize = (
  imageSize: ImageSize,
  viewportSize: CropViewportSize,
  zoom: number
): CropViewportSize => {
  const safeImageSize = getSafeImageSize(imageSize);
  const safeViewportSize = getSafeViewportSize(viewportSize);
  const coverScale = Math.max(
    safeViewportSize.width / safeImageSize.width,
    safeViewportSize.height / safeImageSize.height
  );

  return {
    width: safeImageSize.width * coverScale * zoom,
    height: safeImageSize.height * coverScale * zoom,
  };
};

const clampCropToViewport = (
  crop: PhotoCrop,
  imageSize: ImageSize,
  viewportSize: CropViewportSize
): PhotoCrop => {
  const zoom = clamp(finiteOr(crop.zoom, MIN_ZOOM), MIN_ZOOM, MAX_ZOOM);
  const safeViewportSize = getSafeViewportSize(viewportSize);
  const displaySize = getCoverDisplaySize(imageSize, safeViewportSize, zoom);
  const halfVisibleX = safeViewportSize.width / displaySize.width / 2;
  const halfVisibleY = safeViewportSize.height / displaySize.height / 2;

  return {
    centerX: clamp(finiteOr(crop.centerX, 0.5), halfVisibleX, 1 - halfVisibleX),
    centerY: clamp(finiteOr(crop.centerY, 0.5), halfVisibleY, 1 - halfVisibleY),
    zoom,
  };
};

export const clampCrop = (crop: PhotoCrop, imageSize: ImageSize): PhotoCrop =>
  clampCropToViewport(crop, imageSize, SQUARE_VIEWPORT);

export const panCrop = (
  crop: PhotoCrop,
  imageSize: ImageSize,
  viewportSize: CropViewportSize,
  screenDelta: CropPoint
): PhotoCrop => {
  const clampedCrop = clampCropToViewport(crop, imageSize, viewportSize);
  const displaySize = getCoverDisplaySize(
    imageSize,
    viewportSize,
    clampedCrop.zoom
  );

  return clampCropToViewport(
    {
      ...clampedCrop,
      centerX: clampedCrop.centerX - screenDelta.x / displaySize.width,
      centerY: clampedCrop.centerY - screenDelta.y / displaySize.height,
    },
    imageSize,
    viewportSize
  );
};

export const zoomCropAt = (
  crop: PhotoCrop,
  imageSize: ImageSize,
  viewportSize: CropViewportSize,
  focalPoint: CropPoint,
  zoomMultiplier: number
): PhotoCrop => {
  const safeViewportSize = getSafeViewportSize(viewportSize);
  const clampedCrop = clampCropToViewport(crop, imageSize, safeViewportSize);
  const initialDisplaySize = getCoverDisplaySize(
    imageSize,
    safeViewportSize,
    clampedCrop.zoom
  );
  const nextZoom = clamp(
    clampedCrop.zoom * finiteOr(zoomMultiplier, 1),
    MIN_ZOOM,
    MAX_ZOOM
  );
  const nextDisplaySize = getCoverDisplaySize(
    imageSize,
    safeViewportSize,
    nextZoom
  );
  const offsetX = focalPoint.x - safeViewportSize.width / 2;
  const offsetY = focalPoint.y - safeViewportSize.height / 2;
  const sourceX = clampedCrop.centerX + offsetX / initialDisplaySize.width;
  const sourceY = clampedCrop.centerY + offsetY / initialDisplaySize.height;

  return clampCropToViewport(
    {
      centerX: sourceX - offsetX / nextDisplaySize.width,
      centerY: sourceY - offsetY / nextDisplaySize.height,
      zoom: nextZoom,
    },
    imageSize,
    safeViewportSize
  );
};

const getMidpoint = (points: readonly [CropPoint, CropPoint]): CropPoint => ({
  x: (points[0].x + points[1].x) / 2,
  y: (points[0].y + points[1].y) / 2,
});

const getDistance = (points: readonly [CropPoint, CropPoint]): number =>
  Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);

export const pinchCrop = (
  crop: PhotoCrop,
  imageSize: ImageSize,
  viewportSize: CropViewportSize,
  initialPointers: readonly [CropPoint, CropPoint],
  currentPointers: readonly [CropPoint, CropPoint]
): PhotoCrop => {
  const safeViewportSize = getSafeViewportSize(viewportSize);
  const clampedCrop = clampCropToViewport(crop, imageSize, safeViewportSize);
  const initialDistance = getDistance(initialPointers);

  if (initialDistance === 0) {
    return clampedCrop;
  }

  const initialMidpoint = getMidpoint(initialPointers);
  const currentMidpoint = getMidpoint(currentPointers);
  const initialDisplaySize = getCoverDisplaySize(
    imageSize,
    safeViewportSize,
    clampedCrop.zoom
  );
  const nextZoom = clamp(
    clampedCrop.zoom * (getDistance(currentPointers) / initialDistance),
    MIN_ZOOM,
    MAX_ZOOM
  );
  const nextDisplaySize = getCoverDisplaySize(
    imageSize,
    safeViewportSize,
    nextZoom
  );
  const sourceX =
    clampedCrop.centerX +
    (initialMidpoint.x - safeViewportSize.width / 2) / initialDisplaySize.width;
  const sourceY =
    clampedCrop.centerY +
    (initialMidpoint.y - safeViewportSize.height / 2) /
      initialDisplaySize.height;

  return clampCropToViewport(
    {
      centerX:
        sourceX -
        (currentMidpoint.x - safeViewportSize.width / 2) /
          nextDisplaySize.width,
      centerY:
        sourceY -
        (currentMidpoint.y - safeViewportSize.height / 2) /
          nextDisplaySize.height,
      zoom: nextZoom,
    },
    imageSize,
    safeViewportSize
  );
};

const toPercent = (value: number): string => `${value * 100}%`;

export const getCropImageStyle = (
  imageSize: ImageSize,
  crop: PhotoCrop
): CSSProperties => {
  const clampedCrop = clampCrop(crop, imageSize);
  const displaySize = getCoverDisplaySize(
    imageSize,
    SQUARE_VIEWPORT,
    clampedCrop.zoom
  );

  return {
    position: "absolute",
    maxWidth: "none",
    width: toPercent(displaySize.width),
    height: toPercent(displaySize.height),
    left: toPercent(0.5 - clampedCrop.centerX * displaySize.width),
    top: toPercent(0.5 - clampedCrop.centerY * displaySize.height),
    objectFit: "fill",
    userSelect: "none",
  };
};
