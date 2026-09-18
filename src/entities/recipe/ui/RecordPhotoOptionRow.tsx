"use client";

import type { ReactNode } from "react";

type Props = { label: string; children: ReactNode };

export const RecordPhotoOptionRow = ({ label, children }: Props) => (
  <div
    role="group"
    aria-label={label}
    className="flex gap-2 overflow-x-auto overscroll-x-contain px-[calc(50%-2rem)] pb-2"
    onClickCapture={(event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest("button");
      if (!button || button.disabled) return;
      const row = event.currentTarget;
      if (row.scrollWidth <= row.clientWidth) return;
      const itemBounds = button.getBoundingClientRect();
      const rowBounds = row.getBoundingClientRect();
      row.scrollTo({
        left:
          row.scrollLeft +
          itemBounds.left +
          itemBounds.width / 2 -
          rowBounds.left -
          row.clientWidth / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }}
  >
    {children}
  </div>
);
