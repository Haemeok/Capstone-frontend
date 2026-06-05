import { cn } from "@/shared/lib/utils";

import type { CreatorCountryTag } from "../model/types";

const FLAG_CLASS = "h-4 w-6 shrink-0 rounded-[2px] ring-1 ring-black/10";

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
      d="M12 12 A6 6 0 0 1 24 12 A3 3 0 0 1 18 12 A3 3 0 0 0 12 12 Z"
      fill="#cd2e3a"
    />
    <path
      d="M24 12 A6 6 0 0 1 12 12 A3 3 0 0 1 18 12 A3 3 0 0 0 24 12 Z"
      fill="#0047a0"
    />
    <g fill="#1a1a1a">
      <rect x="5.5" y="4.75" width="5" height="0.7" />
      <rect x="5.5" y="6.15" width="5" height="0.7" />
      <rect x="5.5" y="7.55" width="5" height="0.7" />
      <rect x="25.5" y="4.75" width="2" height="0.7" />
      <rect x="28.5" y="4.75" width="2" height="0.7" />
      <rect x="25.5" y="6.15" width="5" height="0.7" />
      <rect x="25.5" y="7.55" width="2" height="0.7" />
      <rect x="28.5" y="7.55" width="2" height="0.7" />
      <rect x="5.5" y="15.75" width="5" height="0.7" />
      <rect x="5.5" y="17.15" width="2" height="0.7" />
      <rect x="8.5" y="17.15" width="2" height="0.7" />
      <rect x="5.5" y="18.55" width="5" height="0.7" />
      <rect x="25.5" y="15.75" width="2" height="0.7" />
      <rect x="28.5" y="15.75" width="2" height="0.7" />
      <rect x="25.5" y="17.15" width="2" height="0.7" />
      <rect x="28.5" y="17.15" width="2" height="0.7" />
      <rect x="25.5" y="18.55" width="2" height="0.7" />
      <rect x="28.5" y="18.55" width="2" height="0.7" />
    </g>
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
    return <span className={cn("text-base leading-none", className)}>🌐</span>;
  }
  return null;
};
