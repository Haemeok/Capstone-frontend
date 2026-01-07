import { create } from "zustand";
import { YoutubeMeta } from "./types";
import { triggerYoutubeImport } from "./api";
import { QueryClient } from "@tanstack/react-query";

type ImportStatus = "pending" | "success" | "error";

type PendingImport = {
  url: string;
  meta: YoutubeMeta;
  status: ImportStatus;
  error?: string;
  startTime: number;
};

type YoutubeImportStore = {
  imports: Record<string, PendingImport>;
  addImport: (url: string, meta: YoutubeMeta) => void;
  updateStatus: (url: string, status: ImportStatus, error?: string) => void;
  removeImport: (url: string) => void;
  startImport: (
    url: string,
    meta: YoutubeMeta,
    queryClient: QueryClient,
    onSuccess?: () => void
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

    try {
      const response = await triggerYoutubeImport(url);

      if ("recipeId" in response) {
        updateStatus(url, "success");
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["recipes"] });
          queryClient.invalidateQueries({ queryKey: ["recipes", "favorite"] });
        }, 3000);
        setTimeout(() => {
          removeImport(url);
          onSuccess?.();
        }, 3000);
      } else {
        updateStatus(url, "error", response.message);
      }
    } catch (error) {
      updateStatus(
        url,
        "error",
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
    }
  },
}));
