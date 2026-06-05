import { cn } from "@/shared/lib/utils";

import type { CreatorCountryTag } from "../model/types";

const FLAG_CLASS = "h-3 w-[18px] shrink-0 rounded-[2px] ring-1 ring-black/10";

const JapanFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 36 24"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="36" height="24" fill="#ffffff" />
    <circle cx="18" cy="12" r="7.2" fill="#bc002d" />
  </svg>
);

const KoreaFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 36 24"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="36" height="24" fill="#ffffff" />
    <path
      d="M18 6 A6 6 0 0 1 18 18 A3 3 0 0 1 18 12 A3 3 0 0 0 18 6 Z"
      fill="#cd2e3a"
    />
    <path
      d="M18 18 A6 6 0 0 1 18 6 A3 3 0 0 1 18 12 A3 3 0 0 0 18 18 Z"
      fill="#0047a0"
    />
  </svg>
);

type CountryFlagGlyphProps = {
  tag?: CreatorCountryTag | null;
  className?: string;
};

export const CountryFlagGlyph = ({ tag, className }: CountryFlagGlyphProps) => {
  if (tag === "JP") return <JapanFlag className={cn(FLAG_CLASS, className)} />;
  if (tag === "KR") return <KoreaFlag className={cn(FLAG_CLASS, className)} />;
  if (tag === "OTHER") {
    return (
      <span className={cn("text-[15px] leading-none", className)}>🌐</span>
    );
  }
  return null;
};
