import { create } from "zustand";

import { type AIModelId } from "@/shared/config/constants/aiModel";

import type {
  AIRecommendedRecipe,
  AIRecommendedRecipeRequest,
  ActiveAIJob,
  AIJobMeta,
  AIJobState,
  PersistedAIJob,
} from "./types";
import {
  addPersistedJob,
  generateIdempotencyKey,
  loadPersistedJobs,
  removePersistedJob,
  updatePersistedJob,
} from "./persistence";

export type AIRecipeGenerationState =
  | "idle"
  | "generating"
  | "completed"
  | "error";

export type AIModel = {
  id: AIModelId;
  name: string;
  description: string;
  image: string;
  loadingAnimation: {
    image: string;
    frames: number;
    duration: number;
  };
};

type AIRecipeStore = {
  generationState: AIRecipeGenerationState;
  selectedAI: AIModel | null;
  generatedRecipeData: AIRecommendedRecipe | null;
  formData: AIRecommendedRecipeRequest | null;
  error: string | null;

  setGenerationState: (state: AIRecipeGenerationState) => void;
  setSelectedAI: (ai: AIModel) => void;
  setGeneratedRecipe: (recipe: AIRecommendedRecipe) => void;
  setFormData: (data: AIRecommendedRecipeRequest) => void;
  setError: (error: string) => void;
  resetStore: () => void;

  startGeneration: (ai: AIModel, formData: AIRecommendedRecipeRequest) => void;
  completeGeneration: (recipe: AIRecommendedRecipe) => void;
  failGeneration: (error: string) => void;
};

export const useAIRecipeStore = create<AIRecipeStore>((set) => ({
  generationState: "idle",
  selectedAI: null,
  generatedRecipeData: null,
  formData: null,
  error: null,

  setGenerationState: (state) => set({ generationState: state }),
  setSelectedAI: (ai) => set({ selectedAI: ai }),
  setGeneratedRecipe: (recipe) => set({ generatedRecipeData: recipe }),
  setFormData: (data) => set({ formData: data }),
  setError: (error) => set({ error }),

  resetStore: () =>
    set({
      generationState: "idle",
      selectedAI: null,
      generatedRecipeData: null,
      formData: null,
      error: null,
    }),

  startGeneration: (ai, formData) =>
    set({
      generationState: "generating",
      selectedAI: ai,
      formData,
      error: null,
    }),

  completeGeneration: (recipe) =>
    set({
      generationState: "completed",
      generatedRecipeData: recipe,
      error: null,
    }),

  failGeneration: (error) =>
    set({
      generationState: "error",
      error,
    }),
}));

// ========== V2 Store with Job Polling ==========

type AIRecipeStoreV2 = {
  jobs: Record<string, ActiveAIJob>;

  createJob: (
    concept: AIModelId,
    request: AIRecommendedRecipeRequest,
    meta: AIJobMeta
  ) => string;
  setJobId: (idempotencyKey: string, jobId: string) => void;
  updateJobProgress: (
    idempotencyKey: string,
    progress: number,
    resultRecipeId?: string
  ) => void;
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

  getJobByConcept: (concept: AIModelId) => ActiveAIJob | undefined;
  getPendingJobs: () => ActiveAIJob[];
  getActiveJobCount: () => number;
};

const toActiveJob = (persisted: PersistedAIJob): ActiveAIJob => ({
  ...persisted,
  state: persisted.jobId ? "polling" : "creating",
  progress: 0,
});

export const useAIRecipeStoreV2 = create<AIRecipeStoreV2>((set, get) => ({
  jobs: {},

  createJob: (concept, request, meta) => {
    const existingJob = get().getJobByConcept(concept);
    if (existingJob && existingJob.state !== "completed" && existingJob.state !== "failed") {
      return existingJob.idempotencyKey;
    }

    const idempotencyKey = generateIdempotencyKey();
    const now = Date.now();

    const persistedJob: PersistedAIJob = {
      idempotencyKey,
      concept,
      meta,
      request,
      jobId: null,
      startTime: now,
      lastPollTime: now,
      retryCount: 0,
    };

    const activeJob: ActiveAIJob = {
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
            state: "polling" as AIJobState,
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
            state: "completed" as AIJobState,
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
            state: "failed" as AIJobState,
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
    const activeJobs: Record<string, ActiveAIJob> = {};

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

  getJobByConcept: (concept) => {
    const jobs = get().jobs;
    return Object.values(jobs).find((job) => job.concept === concept);
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
}));
