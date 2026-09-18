import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef } from "react";

import {
  clampCrop,
  type CropPoint,
  type CropViewportSize,
  type ImageSize,
  panCrop,
  type PhotoCrop,
  pinchCrop,
  zoomCropAt,
} from "@/shared/lib/image-crop";

type DragGesture = {
  type: "drag";
  pointerId: number;
  origin: CropPoint;
  crop: PhotoCrop;
};

type PinchGesture = {
  type: "pinch";
  pointerIds: [number, number];
  origins: [CropPoint, CropPoint];
  crop: PhotoCrop;
};

type Gesture = { type: "idle" } | DragGesture | PinchGesture;

type UseCropInteractionsParams = {
  imageSize: ImageSize;
  crop: PhotoCrop;
  onChange: (crop: PhotoCrop) => void;
  onCancel: () => void;
  onComplete: () => void;
  isDisabled: boolean;
};

const getViewportSize = (element: HTMLElement): CropViewportSize => {
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
};

const getLocalPoint = (
  element: HTMLElement,
  clientX: number,
  clientY: number
): CropPoint => {
  const rect = element.getBoundingClientRect();
  return { x: clientX - rect.left, y: clientY - rect.top };
};

export const useCropInteractions = ({
  imageSize,
  crop,
  onChange,
  onCancel,
  onComplete,
  isDisabled,
}: UseCropInteractionsParams) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, CropPoint>());
  const gestureRef = useRef<Gesture>({ type: "idle" });
  const latestCropRef = useRef(clampCrop(crop, imageSize));

  useEffect(() => {
    latestCropRef.current = clampCrop(crop, imageSize);
  }, [crop, imageSize]);

  const emitChange = (nextCrop: PhotoCrop) => {
    latestCropRef.current = nextCrop;
    onChange(nextCrop);
  };

  const restartGesture = () => {
    const entries = Array.from(pointersRef.current.entries());
    const first = entries[0];
    const second = entries[1];

    if (first && second) {
      gestureRef.current = {
        type: "pinch",
        pointerIds: [first[0], second[0]],
        origins: [first[1], second[1]],
        crop: latestCropRef.current,
      };
      return;
    }

    if (first) {
      gestureRef.current = {
        type: "drag",
        pointerId: first[0],
        origin: first[1],
        crop: latestCropRef.current,
      };
      return;
    }

    gestureRef.current = { type: "idle" };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointersRef.current.set(
      event.pointerId,
      getLocalPoint(event.currentTarget, event.clientX, event.clientY)
    );
    restartGesture();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isDisabled || !pointersRef.current.has(event.pointerId)) return;

    const point = getLocalPoint(
      event.currentTarget,
      event.clientX,
      event.clientY
    );
    pointersRef.current.set(event.pointerId, point);
    const viewportSize = getViewportSize(event.currentTarget);
    const gesture = gestureRef.current;

    if (gesture.type === "drag" && gesture.pointerId === event.pointerId) {
      emitChange(
        panCrop(gesture.crop, imageSize, viewportSize, {
          x: point.x - gesture.origin.x,
          y: point.y - gesture.origin.y,
        })
      );
      return;
    }

    if (gesture.type === "pinch") {
      const first = pointersRef.current.get(gesture.pointerIds[0]);
      const second = pointersRef.current.get(gesture.pointerIds[1]);
      if (!first || !second) return;

      emitChange(
        pinchCrop(gesture.crop, imageSize, viewportSize, gesture.origins, [
          first,
          second,
        ])
      );
    }
  };

  const finishPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(event.pointerId)) return;

    pointersRef.current.delete(event.pointerId);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    restartGesture();
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (isDisabled) return;
      const viewportSize = getViewportSize(viewport);
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? viewportSize.height
            : 1);
      const nextCrop = zoomCropAt(
        latestCropRef.current,
        imageSize,
        viewportSize,
        getLocalPoint(viewport, event.clientX, event.clientY),
        Math.exp(-delta * 0.002)
      );
      latestCropRef.current = nextCrop;
      onChange(nextCrop);
    };
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [imageSize, isDisabled, onChange]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    const viewportSize = getViewportSize(event.currentTarget);
    const movement = event.shiftKey ? 30 : 12;
    const screenDeltaByKey: Partial<Record<string, CropPoint>> = {
      ArrowLeft: { x: -movement, y: 0 },
      ArrowRight: { x: movement, y: 0 },
      ArrowUp: { x: 0, y: -movement },
      ArrowDown: { x: 0, y: movement },
    };
    const screenDelta = screenDeltaByKey[event.key];

    if (screenDelta) {
      event.preventDefault();
      emitChange(
        panCrop(latestCropRef.current, imageSize, viewportSize, screenDelta)
      );
      return;
    }

    if (["+", "="].includes(event.key) || ["-", "_"].includes(event.key)) {
      event.preventDefault();
      emitChange(
        zoomCropAt(
          latestCropRef.current,
          imageSize,
          viewportSize,
          { x: viewportSize.width / 2, y: viewportSize.height / 2 },
          ["+", "="].includes(event.key) ? 1.1 : 1 / 1.1
        )
      );
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    } else if (event.key === "Enter") {
      event.preventDefault();
      onComplete();
    }
  };

  return {
    viewportRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: finishPointer,
    handlePointerCancel: finishPointer,
    handleKeyDown,
  };
};
