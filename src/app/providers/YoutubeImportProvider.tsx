"use client";

import { type PropsWithChildren, useEffect } from "react";

import {
  useJobPolling,
  useYoutubeImportStoreV2,
} from "@/features/recipe-import-youtube";

export const YoutubeImportProvider = ({ children }: PropsWithChildren) => {
  const hydrateFromStorage = useYoutubeImportStoreV2(
    (state) => state.hydrateFromStorage
  );

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useJobPolling();

  return <>{children}</>;
};
