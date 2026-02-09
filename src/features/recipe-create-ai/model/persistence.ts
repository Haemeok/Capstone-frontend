import { storage } from "@/shared/lib/storage";

import { AI_JOB_POLLING_CONFIG } from "../lib/constants";
import { PersistedAIJob } from "./types";

export const generateIdempotencyKey = (): string => crypto.randomUUID();

export const loadPersistedJobs = (): PersistedAIJob[] => {
  const data = storage.getItem(AI_JOB_POLLING_CONFIG.STORAGE_KEY);
  if (!data) return [];

  try {
    const jobs: PersistedAIJob[] = JSON.parse(data);
    const now = Date.now();

    return jobs.filter(
      (job) => now - job.startTime < AI_JOB_POLLING_CONFIG.JOB_TTL_MS
    );
  } catch {
    return [];
  }
};

export const persistJobs = (jobs: PersistedAIJob[]): void => {
  storage.setItem(AI_JOB_POLLING_CONFIG.STORAGE_KEY, JSON.stringify(jobs));
};

export const addPersistedJob = (job: PersistedAIJob): void => {
  const jobs = loadPersistedJobs();
  const existingIndex = jobs.findIndex(
    (j) => j.idempotencyKey === job.idempotencyKey
  );

  if (existingIndex >= 0) {
    jobs[existingIndex] = job;
  } else {
    jobs.push(job);
  }

  persistJobs(jobs);
};

export const updatePersistedJob = (
  idempotencyKey: string,
  updates: Partial<PersistedAIJob>
): void => {
  const jobs = loadPersistedJobs();
  const index = jobs.findIndex((j) => j.idempotencyKey === idempotencyKey);

  if (index >= 0) {
    jobs[index] = { ...jobs[index], ...updates };
    persistJobs(jobs);
  }
};

export const removePersistedJob = (idempotencyKey: string): void => {
  const jobs = loadPersistedJobs();
  const filtered = jobs.filter((j) => j.idempotencyKey !== idempotencyKey);
  persistJobs(filtered);
};

export const clearAllPersistedJobs = (): void => {
  storage.removeItem(AI_JOB_POLLING_CONFIG.STORAGE_KEY);
};
