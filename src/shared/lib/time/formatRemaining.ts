const pad = (n: number): string => String(n).padStart(2, "0");

const DAY_UNIT: Record<string, string> = {
  ko: "일",
  ja: "日",
  en: "d",
};

export const formatRemaining = (ms: number, locale = "ko"): string => {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const unit = DAY_UNIT[locale] ?? DAY_UNIT.ko;
  return days > 0 ? `${days}${unit} ${clock}` : clock;
};
