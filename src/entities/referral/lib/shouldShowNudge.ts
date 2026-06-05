export const NUDGE_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

type ShouldShowNudgeArgs = {
  campaignActive: boolean;
  lastOpenedAt: number | null;
  now: number;
};

export const shouldShowNudge = ({
  campaignActive,
  lastOpenedAt,
  now,
}: ShouldShowNudgeArgs): boolean => {
  if (!campaignActive) return false;
  if (lastOpenedAt === null) return true;
  return now - lastOpenedAt > NUDGE_INTERVAL_MS;
};
