"use client";

import type { ReactNode } from "react";
import { useId } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import type { ImageSize, PhotoCrop } from "@/shared/lib/image-crop";

import { CroppedPhoto } from "./CroppedPhoto";
import { useCropInteractions } from "./useCropInteractions";

type ImageCropEditorCopy = {
  title: string;
  hint: string;
  cancel: string;
  done: string;
  replace: string;
};

export type ImageCropEditorProps = {
  src: string;
  imageSize: ImageSize;
  crop: PhotoCrop;
  maskPath: string;
  onChange: (crop: PhotoCrop) => void;
  onComplete: () => void;
  onCancel: () => void;
  onReplace: () => void;
  copy: ImageCropEditorCopy;
  errorFallback?: ReactNode;
  isDisabled?: boolean;
  isCompleteDisabled?: boolean;
};

export const ImageCropEditor = ({
  src,
  imageSize,
  crop,
  maskPath,
  onChange,
  onComplete,
  onCancel,
  onReplace,
  copy,
  errorFallback,
  isDisabled = false,
  isCompleteDisabled = false,
}: ImageCropEditorProps) => {
  const hintId = `crop-hint-${useId().replaceAll(":", "")}`;
  const handleComplete = () => {
    if (isDisabled || isCompleteDisabled) return;
    triggerHaptic("Success");
    onComplete();
  };
  const {
    viewportRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown,
  } = useCropInteractions({
    imageSize,
    crop,
    onChange,
    onCancel,
    onComplete: handleComplete,
    isDisabled,
  });

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex min-h-14 items-center justify-between border-b border-gray-100 px-4">
        <button
          type="button"
          disabled={isDisabled}
          onClick={onCancel}
          className="text-ink-sub disabled:text-ink-disabled min-h-11 cursor-pointer px-1 text-sm font-medium disabled:cursor-not-allowed"
        >
          {copy.cancel}
        </button>
        <h2 className="text-ink text-base font-bold">{copy.title}</h2>
        <button
          type="button"
          disabled={isDisabled || isCompleteDisabled}
          onClick={handleComplete}
          className="text-ink disabled:text-ink-disabled min-h-11 cursor-pointer px-1 text-sm font-semibold disabled:cursor-not-allowed"
        >
          {copy.done}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col justify-center bg-gray-50 px-4 py-6">
        <div
          ref={viewportRef}
          data-vaul-no-drag
          role="application"
          aria-label={copy.title}
          aria-describedby={hintId}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
          className="focus-visible:ring-ring relative mx-auto aspect-square w-full max-w-md cursor-move touch-none overflow-hidden rounded-2xl bg-gray-100 outline-none select-none focus-visible:ring-2"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onKeyDown={handleKeyDown}
        >
          <CroppedPhoto
            src={src}
            imageSize={imageSize}
            crop={crop}
            maskPath={maskPath}
            alt=""
            errorFallback={errorFallback}
            showCropBoundary
          />
        </div>
        <p
          id={hintId}
          className="text-ink-muted mt-4 text-center text-sm leading-6"
        >
          {copy.hint}
        </p>
      </div>

      <footer className="border-t border-gray-100 p-4">
        <button
          type="button"
          disabled={isDisabled}
          onClick={onReplace}
          className="text-ink disabled:text-ink-disabled h-12 w-full cursor-pointer rounded-xl bg-gray-100 text-sm font-semibold transition-colors active:bg-gray-200 disabled:cursor-not-allowed"
        >
          {copy.replace}
        </button>
      </footer>
    </section>
  );
};
