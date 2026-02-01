import { create } from "zustand";
import { YoutubeMeta } from "./types";
import { triggerYoutubeImport } from "./api";
import { QueryClient } from "@tanstack/react-query";
import { toYoutubeImportError, YoutubeImportError } from "../lib/errors";

type ImportStatus = "pending" | "success" | "error";

type PendingImport = {
  url: string;
  meta: YoutubeMeta;
  status: ImportStatus;
  error?: YoutubeImportError;
  startTime: number;
};

type YoutubeImportStore = {
  imports: Record<string, PendingImport>;
  addImport: (url: string, meta: YoutubeMeta) => void;
  updateStatus: (
    url: string,
    status: ImportStatus,
    error?: YoutubeImportError
  ) => void;
  removeImport: (url: string) => void;
  startImport: (
    url: string,
    meta: YoutubeMeta,
    queryClient: QueryClient,
    onSuccess?: (recipeId: string) => void
  ) => Promise<void>;
};

export const useYoutubeImportStore = create<YoutubeImportStore>((set, get) => ({
  imports: {},

  addImport: (url, meta) =>
    set((state) => ({
      imports: {
        ...state.imports,
        [url]: {
          url,
          meta,
          status: "pending",
          startTime: Date.now(),
        },
      },
    })),

  updateStatus: (url, status, error) =>
    set((state) => ({
      imports: {
        ...state.imports,
        [url]: { ...state.imports[url], status, error },
      },
    })),

  removeImport: (url) =>
    set((state) => {
      const newImports = { ...state.imports };
      delete newImports[url];
      return { imports: newImports };
    }),

  startImport: async (url, meta, queryClient, onSuccess) => {
    const { addImport, updateStatus, removeImport } = get();

    if (get().imports[url]) return;

    addImport(url, meta);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    }, 1500);

    try {
      const response = await triggerYoutubeImport(url);

      if ("recipeId" in response) {
        updateStatus(url, "success");
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["recipes"] });
          queryClient.invalidateQueries({ queryKey: ["recipes", "favorite"] });
          queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        }, 3000);
        setTimeout(() => {
          removeImport(url);
          onSuccess?.(response.recipeId);
        }, 3000);
      } else {
        const errorInfo = toYoutubeImportError({
          data: response,
        } as unknown);
        updateStatus(url, "error", errorInfo);
      }
    } catch (error) {
      const errorInfo = toYoutubeImportError(error);
      updateStatus(url, "error", errorInfo);
    }
  },
}));
