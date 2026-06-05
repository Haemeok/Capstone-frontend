const formatUntilDate = (iso: string | null): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
};

const formatDaysLeft = (ms: number): string => {
  const days = Math.floor(ms / 86400000);
  return days > 0 ? `${days}일 남음` : "오늘까지";
};

type AdFreeActiveNoticeProps = {
  remaining: number;
  adFreeUntil: string | null;
};

export const AdFreeActiveNotice = ({
  remaining,
  adFreeUntil,
}: AdFreeActiveNoticeProps) => {
  const untilDate = formatUntilDate(adFreeUntil);

  return (
    <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-blue-500">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
        aria-hidden="true"
      />
      광고 없이 이용 중 · {untilDate}까지 · {formatDaysLeft(remaining)}
    </p>
  );
};
