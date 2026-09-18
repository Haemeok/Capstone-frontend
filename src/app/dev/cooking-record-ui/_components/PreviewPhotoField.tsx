"use client";

import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";

import type {
  RecordPhotoCatalogState,
  RecordPhotoDraft,
} from "@/entities/recipe/model/recordPhoto.types";

import { CookingRecordPhotoField } from "@/features/cooking-record-photo-edit";

type Props = {
  value: RecordPhotoDraft;
  catalog: RecordPhotoCatalogState;
  copy: RecordPhotoCopy;
  error?: string;
  onBusyChange?: (busy: boolean) => void;
  onChange: (value: RecordPhotoDraft) => void;
  onFile?: (file: File) => void;
  onRetry: () => void;
};
export const PreviewPhotoField = ({
  value,
  catalog,
  copy,
  error,
  onBusyChange,
  onChange,
  onFile,
  onRetry,
}: Props) => (
  <CookingRecordPhotoField
    value={value}
    catalog={catalog}
    copy={copy}
    error={error}
    onBusyChange={onBusyChange}
    onRetry={onRetry}
    onChange={(next) => {
      onChange(next);
      if (next.originalFile && next.originalFile !== value.originalFile)
        onFile?.(next.originalFile);
    }}
  />
);
