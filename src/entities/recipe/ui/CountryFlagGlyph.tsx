import { cn } from "@/shared/lib/utils";

import { getCreatorCountryFlag } from "../lib/getCreatorCountryFlag";
import type { CreatorCountryTag } from "../model/types";

const JapanFlag = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 15 10"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="15" height="10" fill="#ffffff" />
    <circle cx="7.5" cy="5" r="3" fill="#bc002d" />
  </svg>
);

type CountryFlagGlyphProps = {
  tag?: CreatorCountryTag | null;
  className?: string;
};

export const CountryFlagGlyph = ({ tag, className }: CountryFlagGlyphProps) => {
  const flag = getCreatorCountryFlag(tag);
  if (!flag) return null;

  if (flag.variant === "jp") {
    return (
      <JapanFlag
        className={cn(
          "h-3 w-[18px] shrink-0 rounded-[2px] ring-1 ring-black/10",
          className
        )}
      />
    );
  }

  return (
    <span className={cn("text-[15px] leading-none", className)}>🌐</span>
  );
};
