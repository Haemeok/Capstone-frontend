import { format } from "@/shared/i18n";
import type { UserPagesDict } from "@/shared/i18n/types";

export const motivationalMessage = (
  count: number,
  m: UserPagesDict["calendar"]["streakMessages"]
): string => {
  if (count === 0) return m.start;
  if (count === 1) return m.day1;
  if (count < 4) return format(m.streak, { n: count });
  if (count < 7) return format(m.homeCooking, { n: count });
  if (count < 10) return format(m.great, { n: count });
  if (count < 20) return format(m.onFire, { n: count });
  return format(m.incredible, { n: count });
};
