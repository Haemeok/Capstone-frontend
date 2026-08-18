import { Loader2 } from "lucide-react";

import type { UserPagesDict } from "@/shared/i18n";

type DailyCookingRecordStatusProps = {
  isAuthReady: boolean;
  authGate: boolean;
  isPending: boolean;
  isError: boolean;
  hasRecords: boolean;
  copy: UserPagesDict["calendar"]["dailyRecord"]["state"];
  onRetry: () => void;
  onLogin: () => void;
};

export const DailyCookingRecordStatus = ({
  isAuthReady,
  authGate,
  isPending,
  isError,
  hasRecords,
  copy,
  onRetry,
  onLogin,
}: DailyCookingRecordStatusProps) => {
  if (!isAuthReady || (authGate && isPending)) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="text-ink-muted flex min-h-40 items-center justify-center gap-2 px-[18px] text-sm"
      >
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        {isAuthReady ? copy.loading : copy.checkingAuth}
      </div>
    );
  }
  if (!authGate) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-[18px] text-center">
        <p className="text-ink text-[15px] font-bold">{copy.loginTitle}</p>
        <p className="text-ink-muted mt-2 max-w-72 text-[13px] leading-5.5">
          {copy.loginDescription}
        </p>
        <button
          type="button"
          onClick={onLogin}
          className="text-ink focus-visible:outline-olive-dark mt-4 min-h-11 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {copy.loginAction}
        </button>
      </div>
    );
  }
  if (authGate && isError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center px-[18px] text-center">
        <p className="text-ink text-[15px] font-bold">{copy.error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-ink focus-visible:outline-olive-dark mt-4 min-h-11 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {copy.retry}
        </button>
      </div>
    );
  }
  if (authGate && !hasRecords) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-[18px] text-center">
        <p className="text-ink text-[15px] font-bold">{copy.emptyTitle}</p>
        <p className="text-ink-muted mt-2 max-w-72 text-[13px] leading-5.5">
          {copy.emptyDescription}
        </p>
      </div>
    );
  }
  return null;
};
