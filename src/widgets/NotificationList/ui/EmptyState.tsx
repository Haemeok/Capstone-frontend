type EmptyStateProps = {
  message?: string;
  className?: string;
};

export const EmptyState = ({
  message = "알림이 없습니다.",
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`text-center p-8 text-gray-500 ${className}`}>
      <p>{message}</p>
    </div>
  );
};
