"use client";

type YoutubeQuotaBadgeProps = {
  remainingQuota: number | undefined;
};

export const YoutubeQuotaBadge = ({ remainingQuota }: YoutubeQuotaBadgeProps) => {
  if (remainingQuota === undefined) return null;

  const hasQuota = remainingQuota > 0;

  if (hasQuota) {
    return (
      <p className="text-center text-sm text-gray-500">
        오늘{" "}
        <span className="font-bold text-olive-light">{remainingQuota}번</span>{" "}
        더 추출할 수 있어요
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-gray-400">
      오늘의 추출 횟수를 모두 사용했어요
    </p>
  );
};
