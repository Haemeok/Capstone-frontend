"use client";

import { usePathname } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { recordPhotoMessages } from "@/shared/i18n/recordPhotoMessages";
import { resolveChromeLocale } from "@/shared/i18n/resolveChromeLocale";

import type {
  RecordPhotoCatalogState,
  RecordPhotoEditorProps,
} from "@/entities/recipe/model/recordPhoto.types";
import { getRecordPhotoCatalog } from "@/entities/recipe/model/recordPhotoCatalog";
import { useAuthGate } from "@/entities/user";

import { CookingRecordPhotoField } from "./CookingRecordPhotoField";

export const ConnectedCookingRecordPhotoField = (
  props: RecordPhotoEditorProps
) => {
  const locale = resolveChromeLocale(usePathname() ?? "/");
  const isAuthenticated = useAuthGate();
  const query = useQuery({
    queryKey: ["cooking-record", "plate-catalog"],
    queryFn: getRecordPhotoCatalog,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  const catalog: RecordPhotoCatalogState = query.data
    ? { status: "ready", catalog: query.data }
    : { status: query.isError ? "error" : "loading" };
  return (
    <CookingRecordPhotoField
      {...props}
      catalog={catalog}
      copy={recordPhotoMessages[locale]}
      stickerProcessingMode="after-save"
      onRetry={() => void query.refetch()}
    />
  );
};
