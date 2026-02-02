export const JOB_POLLING_CONFIG = {
  STORAGE_KEY: "youtube-extraction-jobs",
  POLLING_INTERVAL_MS: 7000,
  ZOMBIE_THRESHOLD_MS: 30000,
  MAX_RETRY_COUNT: 3,
  JOB_TTL_MS: 30 * 60 * 1000, // 30분
} as const;
