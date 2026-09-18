import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";
import { triggerHaptic } from "@/shared/lib/bridge";

type Props = {
  isPending: boolean;
  hasError: boolean;
  isUnavailable: boolean;
  onRetry: () => void;
  copy: RecordPhotoCopy;
};

export const RecordStickerPreviewStatus = ({
  isPending,
  hasError,
  isUnavailable,
  onRetry,
  copy,
}: Props) => {
  if (!isPending && !hasError && !isUnavailable) return null;
  return (
    <div className="text-ink-muted px-4 text-center text-sm" aria-live="polite">
      <p role={hasError || isUnavailable ? "alert" : "status"}>
        {isUnavailable
          ? copy.stickerUnavailable
          : hasError
            ? copy.stickerFailed
            : copy.stickerProcessing}
      </p>
      {hasError && !isUnavailable ? (
        <button
          type="button"
          className="text-ink min-h-11 cursor-pointer underline"
          onClick={() => {
            triggerHaptic("Light");
            onRetry();
          }}
        >
          {copy.retry}
        </button>
      ) : null}
    </div>
  );
};
