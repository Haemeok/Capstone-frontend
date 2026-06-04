import { cn } from "@/shared/lib/utils";

import { getCreatorCountryFlag } from "../lib/getCreatorCountryFlag";
import type { CreatorCountryTag } from "../model/types";

type CreatorCountryFlagProps = {
  tag?: CreatorCountryTag | null;
  className?: string;
};

export const CreatorCountryFlag = ({
  tag,
  className,
}: CreatorCountryFlagProps) => {
  const flag = getCreatorCountryFlag(tag);
  if (!flag) return null;

  return (
    <span
      role="img"
      aria-label={flag.label}
      className={cn(
        "inline-flex items-center rounded-full bg-black/45 px-1.5 py-0.5 text-[13px] leading-none backdrop-blur-sm",
        className
      )}
    >
      {flag.emoji}
    </span>
  );
};
