type AdPlaceholderProps = {
  minHeight: number;
  label?: string;
  className?: string;
};

export const AdPlaceholder = ({
  minHeight,
  label = "광고 영역",
  className,
}: AdPlaceholderProps) => {
  return (
    <div
      aria-hidden
      className={
        "flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs font-medium text-gray-400" +
        (className ? ` ${className}` : "")
      }
      style={{ minHeight }}
    >
      {label} (dev)
    </div>
  );
};
