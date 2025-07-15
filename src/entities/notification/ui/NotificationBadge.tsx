type NotificationBadgeProps = {
  count: number;
  maxCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showZero?: boolean;
};

export const NotificationBadge = ({
  count,
  maxCount = 99,
  size = "md",
  className = "",
  showZero = false,
}: NotificationBadgeProps) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeClasses = {
    sm: "min-w-4 h-4 text-xs px-1",
    md: "min-w-5 h-5 text-xs px-1.5",
    lg: "min-w-6 h-6 text-sm px-2",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full bg-red-500 text-white font-medium
        ${sizeClasses[size]} ${className}
      `}
      aria-label={`읽지 않은 알림 ${count}개`}
    >
      {displayCount}
    </span>
  );
};
