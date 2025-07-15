type ErrorStateProps = {
  onRetry: () => void;
  message?: string;
  className?: string;
};

export const ErrorState = ({
  onRetry,
  message = "알림을 불러오는 중 오류가 발생했습니다.",
  className = "",
}: ErrorStateProps) => {
  return (
    <div className={`text-center p-8 ${className}`}>
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        다시 시도
      </button>
    </div>
  );
};
