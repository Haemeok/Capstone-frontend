"use client";

type SubmitButtonProps = {
  isDisabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export const SubmitButton = ({
  isDisabled,
  isSubmitting,
  onSubmit,
}: SubmitButtonProps) => (
  <div className="shrink-0 px-6 pt-3 pb-6">
    <button
      type="button"
      onClick={onSubmit}
      disabled={isDisabled}
      className={
        isDisabled
          ? "h-12 w-full cursor-not-allowed rounded-2xl bg-gray-100 text-base font-bold text-gray-400 transition-all"
          : "bg-olive-light h-12 w-full cursor-pointer rounded-2xl text-base font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
      }
    >
      {isSubmitting ? "신고 중..." : "신고하기"}
    </button>
  </div>
);
