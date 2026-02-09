import { create } from "zustand";

import { QueryClient } from "@tanstack/react-query";

import { toYoutubeImportError, YoutubeImportError } from "../lib/errors";
import { triggerYoutubeImport } from "./api";
import {
  addPersistedJob,
  generateIdempotencyKey,
  loadPersistedJobs,
  removePersistedJob,
  updatePersistedJob,
} from "./persistence";
import { ActiveJob, JobState, PersistedJob, YoutubeMeta } from "./types";

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

// ========== V2 Store with Job Polling ==========

type YoutubeImportStoreV2 = {
  jobs: Record<string, ActiveJob>;

  createJob: (url: string, meta: YoutubeMeta) => string;
  setJobId: (idempotencyKey: string, jobId: string) => void;
  updateJobProgress: (
    idempotencyKey: string,
    progress: number,
    resultRecipeId?: string
  ) => void;
  completeJob: (idempotencyKey: string, recipeId: string) => void;
  failJob: (idempotencyKey: string, code: string | undefined, message: string) => void;
  removeJob: (idempotencyKey: string) => void;

  hydrateFromStorage: () => void;
  incrementRetryCount: (idempotencyKey: string) => void;
  updateLastPollTime: (idempotencyKey: string) => void;

  getJobByUrl: (url: string) => ActiveJob | undefined;
  getPendingJobs: () => ActiveJob[];
  getActiveJobCount: () => number;
};

const toActiveJob = (persisted: PersistedJob): ActiveJob => ({
  ...persisted,
  state: persisted.jobId ? "polling" : "creating",
  progress: 0,
});

export const useYoutubeImportStoreV2 = create<YoutubeImportStoreV2>(
  (set, get) => ({
    jobs: {},

    createJob: (url, meta) => {
      const existingJob = get().getJobByUrl(url);
      if (existingJob) {
        return existingJob.idempotencyKey;
      }

      const idempotencyKey = generateIdempotencyKey();
      const now = Date.now();

      const persistedJob: PersistedJob = {
        idempotencyKey,
        url,
        meta,
        jobId: null,
        startTime: now,
        lastPollTime: now,
        retryCount: 0,
      };

      const activeJob: ActiveJob = {
        ...persistedJob,
        state: "creating",
        progress: 0,
      };

      addPersistedJob(persistedJob);

      set((state) => ({
        jobs: {
          ...state.jobs,
          [idempotencyKey]: activeJob,
        },
      }));

      return idempotencyKey;
    },

    setJobId: (idempotencyKey, jobId) => {
      const now = Date.now();

      updatePersistedJob(idempotencyKey, { jobId, lastPollTime: now });

      set((state) => {
        const job = state.jobs[idempotencyKey];
        if (!job) return state;

        return {
          jobs: {
            ...state.jobs,
            [idempotencyKey]: {
              ...job,
              jobId,
              state: "polling" as JobState,
              lastPollTime: now,
            },
          },
        };
      });
    },

    updateJobProgress: (idempotencyKey, progress, resultRecipeId) => {
      const now = Date.now();

      updatePersistedJob(idempotencyKey, { lastPollTime: now });

      set((state) => {
        const job = state.jobs[idempotencyKey];
        if (!job) return state;

        return {
          jobs: {
            ...state.jobs,
            [idempotencyKey]: {
              ...job,
              progress,
              lastPollTime: now,
              ...(resultRecipeId && { resultRecipeId }),
            },
          },
        };
      });
    },

    completeJob: (idempotencyKey, recipeId) => {
      removePersistedJob(idempotencyKey);

      set((state) => {
        const job = state.jobs[idempotencyKey];
        if (!job) return state;

        return {
          jobs: {
            ...state.jobs,
            [idempotencyKey]: {
              ...job,
              state: "completed" as JobState,
              progress: 100,
              resultRecipeId: recipeId,
            },
          },
        };
      });
    },

    failJob: (idempotencyKey, code, message) => {
      removePersistedJob(idempotencyKey);

      set((state) => {
        const job = state.jobs[idempotencyKey];
        if (!job) return state;

        return {
          jobs: {
            ...state.jobs,
            [idempotencyKey]: {
              ...job,
              state: "failed" as JobState,
              code,
              message,
            },
          },
        };
      });
    },

    removeJob: (idempotencyKey) => {
      removePersistedJob(idempotencyKey);

      set((state) => {
        const newJobs = { ...state.jobs };
        delete newJobs[idempotencyKey];
        return { jobs: newJobs };
      });
    },

    hydrateFromStorage: () => {
      const persistedJobs = loadPersistedJobs();
      const activeJobs: Record<string, ActiveJob> = {};

      for (const persisted of persistedJobs) {
        activeJobs[persisted.idempotencyKey] = toActiveJob(persisted);
      }

      set({ jobs: activeJobs });
    },

    incrementRetryCount: (idempotencyKey) => {
      set((state) => {
        const job = state.jobs[idempotencyKey];
        if (!job) return state;

        const newRetryCount = job.retryCount + 1;

        updatePersistedJob(idempotencyKey, { retryCount: newRetryCount });

        return {
          jobs: {
            ...state.jobs,
            [idempotencyKey]: {
              ...job,
              retryCount: newRetryCount,
            },
          },
        };
      });
    },

    updateLastPollTime: (idempotencyKey) => {
      const now = Date.now();

      updatePersistedJob(idempotencyKey, { lastPollTime: now });

      set((state) => {
        const job = state.jobs[idempotencyKey];
        if (!job) return state;

        return {
          jobs: {
            ...state.jobs,
            [idempotencyKey]: {
              ...job,
              lastPollTime: now,
            },
          },
        };
      });
    },

    getJobByUrl: (url) => {
      const jobs = get().jobs;
      return Object.values(jobs).find((job) => job.url === url);
    },

    getPendingJobs: () => {
      const jobs = get().jobs;
      return Object.values(jobs).filter(
        (job) => job.state === "polling" || job.state === "creating"
      );
    },

    getActiveJobCount: () => {
      return get().getPendingJobs().length;
    },
  })
);
