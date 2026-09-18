"use client";

import { X } from "lucide-react";

import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type {
  RecordPhotoCatalogState,
  RecordPhotoDraft,
  RecordPlateCategory,
} from "../model/recordPhoto.types";
import { CookingRecordShapeOptions } from "./CookingRecordShapeOptions";
import { RecordPhotoOptionRow } from "./RecordPhotoOptionRow";

type Props = {
  value: RecordPhotoDraft;
  catalog: RecordPhotoCatalogState;
  copy: RecordPhotoCopy;
  category: RecordPlateCategory | "all";
  onCategoryChange: (category: RecordPlateCategory | "all") => void;
  onChange: (value: RecordPhotoDraft) => void;
  onRetry: () => void;
  disabled?: boolean;
};
const categories: (RecordPlateCategory | "all")[] = [
  "all",
  "plain",
  "pattern",
  "botanical",
  "material",
  "other",
];
const choiceClass =
  "relative grid size-16 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl bg-gray-50 after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:border-2 after:border-transparent aria-pressed:after:border-olive-light focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
export const CookingRecordPhotoOptions = ({
  value,
  catalog,
  copy,
  category,
  onCategoryChange,
  onChange,
  onRetry,
  disabled,
}: Props) => {
  const plates = catalog.status === "ready" ? catalog.catalog.plates : [];
  const shapes = catalog.status === "ready" ? catalog.catalog.maskShapes : [];
  const select = (next: RecordPhotoDraft) => {
    const sameShape =
      value.shape.kind === next.shape.kind &&
      (value.shape.kind !== "mask" ||
        next.shape.kind !== "mask" ||
        value.shape.value === next.shape.value);
    if (sameShape && value.plateId === next.plateId) return;
    triggerHaptic("Light");
    onChange(next);
  };
  return (
    <div className="min-w-0 space-y-5">
      <CookingRecordShapeOptions
        value={value}
        shapes={shapes}
        copy={copy}
        disabled={disabled}
        select={select}
      />
      <section aria-label={copy.plates}>
        <h3 className="text-ink mb-2 text-sm font-semibold">{copy.plates}</h3>
        <div
          role="group"
          aria-label={copy.categories.all}
          className="mb-2 flex gap-2 overflow-x-auto pb-1"
        >
          {categories
            .filter(
              (item) =>
                item !== "other" ||
                plates.some((plate) => plate.category === "other")
            )
            .map((item) => (
              <button
                type="button"
                key={item}
                disabled={disabled}
                aria-pressed={category === item}
                className={cn(
                  "focus-visible:ring-olive-light min-h-[38px] shrink-0 cursor-pointer rounded-full px-[14px] text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  category === item
                    ? "bg-ink text-white"
                    : "text-ink-sub bg-gray-100 active:bg-gray-200"
                )}
                onClick={() => {
                  if (category === item) return;
                  triggerHaptic("Light");
                  onCategoryChange(item);
                }}
              >
                {copy.categories[item]}
              </button>
            ))}
        </div>
        <RecordPhotoOptionRow label={copy.plates}>
          <button
            type="button"
            disabled={disabled}
            className={choiceClass}
            aria-label={copy.none}
            aria-pressed={value.plateId === null}
            onClick={() => select({ ...value, plateId: null })}
          >
            <span className="text-ink-muted flex flex-col items-center gap-1">
              <X aria-hidden="true" className="size-8" strokeWidth={1.5} />
              <span className="text-xs">{copy.none}</span>
            </span>
          </button>
          {plates
            .filter(
              (plate) => category === "all" || plate.category === category
            )
            .map((plate) => (
              <button
                type="button"
                key={plate.plateId}
                disabled={disabled}
                className={choiceClass}
                aria-label={plate.name}
                aria-pressed={value.plateId === plate.plateId}
                onClick={() => select({ ...value, plateId: plate.plateId })}
              >
                <span className="pointer-events-none absolute -inset-[14%]">
                  <Image
                    src={plate.imageUrl}
                    alt=""
                    lazy={false}
                    fit="contain"
                    wrapperClassName="h-full w-full"
                  />
                </span>
              </button>
            ))}
        </RecordPhotoOptionRow>
        {catalog.status !== "ready" ? (
          <p role="status" className="text-ink-muted mt-2 text-sm">
            {catalog.status === "loading" ? copy.loading : copy.error}
          </p>
        ) : null}
        {catalog.status === "error" ? (
          <button
            type="button"
            onClick={() => {
              triggerHaptic("Light");
              onRetry();
            }}
            className="text-ink min-h-11 cursor-pointer text-sm underline"
          >
            {copy.retry}
          </button>
        ) : null}
      </section>
    </div>
  );
};
