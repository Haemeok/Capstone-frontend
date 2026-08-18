import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

type PhotoReviewFilterChipProps = {
  pressed: boolean;
  disabled?: boolean;
  onPressedChange: (pressed: boolean) => void;
};

const PHOTO_CAMERA_PATH =
  "M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9Zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z";

export const PhotoReviewFilterChip = ({
  pressed,
  disabled = false,
  onPressedChange,
}: PhotoReviewFilterChipProps) => {
  const handleClick = () => {
    if (disabled) {
      return;
    }

    triggerHaptic("Light");
    onPressedChange(!pressed);
  };

  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors",
        pressed
          ? "bg-ink text-white"
          : "text-ink-sub bg-gray-100 active:bg-gray-200",
        disabled && "text-ink-disabled cursor-not-allowed bg-gray-100"
      )}
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="shrink-0"
      >
        <path d={PHOTO_CAMERA_PATH} />
      </svg>
      <span>사진 리뷰만 보기</span>
    </button>
  );
};
