"use client";

import { useUiCommonDict } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

type ImageErrorProps = {
  message?: string;
  className?: string;
};

const ImageError = ({ message, className }: ImageErrorProps) => {
  const t = useUiCommonDict();

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-100 text-sm text-gray-400",
        className
      )}
      role="img"
      // 빈 문자열 message도 기본 문구로 대체 (|| 의도)
      aria-label={message || t.image.loadError}
    >
      <img
        src="/noImage.png"
        alt={t.image.loadError}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default ImageError;
