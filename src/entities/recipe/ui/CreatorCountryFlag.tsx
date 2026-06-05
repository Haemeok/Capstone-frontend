import { cn } from "@/shared/lib/utils";

import { getCreatorCountryFlag } from "../lib/getCreatorCountryFlag";
import type { CreatorCountryTag } from "../model/types";
import { CountryFlagGlyph } from "./CountryFlagGlyph";

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
        "inline-flex items-center leading-none drop-shadow-sm",
        className
      )}
    >
      <CountryFlagGlyph tag={tag} />
    </span>
  );
};
