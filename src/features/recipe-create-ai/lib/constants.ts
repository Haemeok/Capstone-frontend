export const AI_JOB_POLLING_CONFIG = {
  STORAGE_KEY: "ai-recipe-generation-jobs",
  POLLING_INTERVAL_MS: 7000,
  ZOMBIE_THRESHOLD_MS: 30000,
  MAX_RETRY_COUNT: 3,
  JOB_TTL_MS: 30 * 60 * 1000,
} as const;
