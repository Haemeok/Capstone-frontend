import type { ChatQuota } from "../model/types";

const QUOTA_WARNING_THRESHOLD = 3;

type ChatQuotaBadgeProps = {
  quota: ChatQuota | undefined;
};

const ChatQuotaBadge = ({ quota }: ChatQuotaBadgeProps) => {
  if (!quota) return null;
  if (quota.remaining > QUOTA_WARNING_THRESHOLD) return null;

  return (
    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      오늘 {quota.remaining}/{quota.dailyLimit}회 남음
    </span>
  );
};

export default ChatQuotaBadge;
