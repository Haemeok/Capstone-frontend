import { triggerHaptic } from "@/shared/lib/bridge";

import { ReportError } from "./reportApi";
import styles from "./ReportView.module.css";

export const ReportStatus = ({
  error,
  missingLink = false,
  onRetry,
}: {
  error?: Error | null;
  missingLink?: boolean;
  onRetry?: () => void;
}) => {
  const expired =
    missingLink ||
    (error instanceof ReportError &&
      (error.status === 401 || error.status === 403));
  const rateLimited = error instanceof ReportError && error.status === 429;
  return (
    <section
      className={styles.statusPanel}
      role={error || missingLink ? "alert" : "status"}
    >
      <h2>
        {expired
          ? "리포트 링크를 확인해 주세요"
          : error
            ? "리포트를 불러오지 못했습니다"
            : "리포트를 불러오고 있습니다"}
      </h2>
      <p>
        {expired
          ? "링크가 만료되었거나 더 이상 사용할 수 없습니다. 전달받은 원래 링크를 다시 열거나 레시피오 담당자에게 새 링크를 요청해 주세요."
          : rateLimited
            ? `${error.retryAfterSeconds}초 후 다시 시도해 주세요.`
            : error
              ? "잠시 후 다시 시도해 주세요."
              : "광고 성과를 확인하고 있습니다."}
      </p>
      {error && !expired && onRetry ? (
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            onRetry();
          }}
        >
          다시 불러오기
        </button>
      ) : null}
    </section>
  );
};
