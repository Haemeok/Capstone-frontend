"use client";
import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";

import { RECORD_MASK_PATHS } from "../model/recordMaskShapes";
import type {
  RecordPhotoCatalog,
  RecordPhotoDraft,
} from "../model/recordPhoto.types";
type Props = {
  value: RecordPhotoDraft;
  shapes: RecordPhotoCatalog["maskShapes"];
  copy: RecordPhotoCopy;
  disabled?: boolean;
  select: (value: RecordPhotoDraft) => void;
};
const choiceClass =
  "relative grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-xl bg-gray-50 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:border-2 after:border-transparent aria-pressed:after:border-olive-light focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
export const CookingRecordShapeOptions = ({
  value,
  shapes,
  copy,
  disabled,
  select,
}: Props) => (
  <section aria-label={copy.shape}>
    <h3 className="text-ink mb-2 text-sm font-semibold">{copy.shape}</h3>
    <div
      role="group"
      aria-label={copy.shape}
      className="flex gap-2 overflow-x-auto overscroll-x-contain pb-2"
    >
      {shapes.map((shape) => (
        <button
          type="button"
          key={shape.value}
          disabled={disabled}
          className={choiceClass}
          aria-label={copy.masks[shape.value] ?? shape.label}
          aria-pressed={
            value.shape.kind === "mask" && value.shape.value === shape.value
          }
          onClick={() =>
            select({
              ...value,
              shape: { kind: "mask", value: shape.value },
            })
          }
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="size-9 fill-[#a9b5a2]"
          >
            <path d={RECORD_MASK_PATHS[shape.value]} />
          </svg>
        </button>
      ))}
    </div>
  </section>
);
