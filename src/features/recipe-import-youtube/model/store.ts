import { create } from "zustand";

import {
  addPersistedJob,
  generateIdempotencyKey,
  loadPersistedJobs,
  removePersistedJob,
  updatePersistedJob,
} from "./persistence";
import {
  selectActiveJobCount,
  selectJobByUrl,
  selectPendingJobs,
} from "./storeSelectors";
import { ActiveJob, PersistedJob, YoutubeMeta } from "./types";

type YoutubeImportStoreV2 = {
  jobs: Record<string, ActiveJob>;

  createJob: (url: string, meta: YoutubeMeta) => string;
  setJobId: (idempotencyKey: string, jobId: string) => void;
  updateJobProgress: (idempotencyKey: string, progress: number) => void;
  completeJob: (idempotencyKey: string, recipeId: string) => void;
  failJob: (
    idempotencyKey: string,
    code: string | undefined,
    message: string
  ) => void;
  removeJob: (idempotencyKey: string) => void;

  hydrateFromStorage: () => void;
  incrementRetryCount: (idempotencyKey: string) => void;
  updateLastPollTime: (idempotencyKey: string) => void;

  getJobByUrl: (url: string) => ActiveJob | undefined;
  getPendingJobs: () => ActiveJob[];
  getActiveJobCount: () => number;
};

const toActiveJob = (persisted: PersistedJob): ActiveJob =>
  persisted.jobId
    ? { ...persisted, state: "polling", progress: 0 }
    : { ...persisted, state: "creating", progress: 0 };

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
              lastPollTime: now,
              state: "polling",
              progress:
                job.state === "polling" || job.state === "creating"
                  ? job.progress
                  : 0,
            },
          },
        };
      });
    },

    updateJobProgress: (idempotencyKey, progress) => {
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
              state: "polling",
              progress,
              lastPollTime: now,
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
              state: "completed",
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
              state: "failed",
              progress:
                job.state === "polling" || job.state === "creating"
                  ? job.progress
                  : 0,
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

    getJobByUrl: (url) => selectJobByUrl(get(), url),

    getPendingJobs: () => selectPendingJobs(get()),

    getActiveJobCount: () => selectActiveJobCount(get()),
  })
);
