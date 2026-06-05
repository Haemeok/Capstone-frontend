export const REFERRAL_QUERY_KEYS = {
  all: ["referral"] as const,
  info: () => [...REFERRAL_QUERY_KEYS.all, "info"] as const,
};
