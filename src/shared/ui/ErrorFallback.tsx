"use client";

type ErrorFallbackProps = {
  reset: () => void;
  message?: string;
};

const ErrorFallback = ({
  reset,
  message = "잠시 후 다시 시도해주세요",
}: ErrorFallbackProps) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <p className="text-lg font-bold text-gray-900">문제가 발생했어요</p>
      <p className="text-sm text-gray-500">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="h-12 rounded-xl bg-olive-light px-6 font-medium text-white transition-colors hover:bg-olive-dark"
        >
          다시 시도
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="h-12 rounded-xl bg-gray-100 px-6 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
