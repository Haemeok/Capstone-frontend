"use client";

type SectionErrorFallbackProps = {
  message?: string;
};

const SectionErrorFallback = ({
  message = "이 영역을 불러올 수 없어요",
}: SectionErrorFallbackProps) => {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default SectionErrorFallback;
