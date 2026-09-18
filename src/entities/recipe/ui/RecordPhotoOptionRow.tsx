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
        const buttons = Array.from(row.querySelectorAll("button"));
        const index = buttons.indexOf(button);
        if (buttons.length <= 5 || index < 0) return;
        const itemBounds = button.getBoundingClientRect();
        const rowBounds = row.getBoundingClientRect();
        const initialScroll = row.scrollLeft;
        const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
        const centeredScroll =
          initialScroll +
          itemBounds.left +
          itemBounds.width / 2 -
          rowBounds.left -
          row.clientWidth / 2;
        let targetScroll = Math.max(0, Math.min(maxScroll, centeredScroll));
        if (index < 2) targetScroll = 0;
        if (index >= buttons.length - 2) targetScroll = maxScroll;
        const update = (progress: number) => {
          row.scrollLeft =
            initialScroll + (targetScroll - initialScroll) * progress;
        };
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          update(1);
          return;
        }
        animation.current = animate(0, 1, {
          duration: 0.35,
          ease: "easeInOut",
          onUpdate: update,
        });
      }}
    >
      {children}
    </div>
  );
};
