"use client";

type SectionErrorFallbackProps = {
  message: string;
};

const SectionErrorFallback = ({ message }: SectionErrorFallbackProps) => (
  <div className="flex items-center justify-center rounded-2xl bg-gray-50 p-6">
    <p className="text-ink-muted text-sm">{message}</p>
  </div>
);

export default SectionErrorFallback;
