"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { animate } from "motion/react";

type Props = { label: string; children: ReactNode };

export const RecordPhotoOptionRow = ({ label, children }: Props) => {
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const stopAnimation = () => animation.current?.stop();
  useEffect(() => () => animation.current?.stop(), []);
  return (
    <div
      role="group"
      aria-label={label}
      className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2"
      onTouchStart={stopAnimation}
      onWheel={stopAnimation}
      onClickCapture={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest("button");
        if (!button || button.disabled) return;
        const row = event.currentTarget;
        if (!row.clientWidth) return;
        stopAnimation();
        const itemBounds = button.getBoundingClientRect();
        const rowBounds = row.getBoundingClientRect();
        const initialScroll = row.scrollLeft;
        const initialPadding =
          parseFloat(getComputedStyle(row).paddingLeft) || 0;
        const targetPadding = Math.max(
          0,
          (row.clientWidth - itemBounds.width) / 2
        );
        const targetScroll =
          initialScroll +
          itemBounds.left +
          itemBounds.width / 2 -
          rowBounds.left -
          row.clientWidth / 2 +
          targetPadding -
          initialPadding;
        const update = (progress: number) => {
          row.style.paddingInline = `${initialPadding + (targetPadding - initialPadding) * progress}px`;
          row.scrollLeft =
            initialScroll + (targetScroll - initialScroll) * progress;
        };
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          update(1);
          return;
        }
        animation.current = animate(0, 1, {
          duration: 0.75,
          ease: "easeInOut",
          onUpdate: update,
        });
      }}
    >
      {children}
    </div>
  );
};
