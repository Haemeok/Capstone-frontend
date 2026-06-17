"use client";

import { LocalizedLink } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";
import BadgeButton from "@/shared/ui/BadgeButton";

import { useUserQuery } from "@/entities/user/model/hooks";

type RecipeExtractorBadgeProps = {
  extractorId: string;
  className?: string;
};

const CreatedByBadge = () => (
  <span className="text-ink-muted flex items-center gap-1 text-sm font-medium">
    🥇 Created by
  </span>
);

const RecipeExtractorBadge = ({
  extractorId,
  className,
}: RecipeExtractorBadgeProps) => {
  const { user: extractor } = useUserQuery(extractorId, true);

  if (!extractor) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <BadgeButton
        badgeText="해당 유튜브 레시피를 처음으로 추출한 분에게 드립니다."
        badgeIcon={<CreatedByBadge />}
      />
      <LocalizedLink
        href={`/users/${extractor.id}`}
        className="text-ink-muted hover:text-ink text-sm hover:underline"
      >
        @{extractor.nickname}
      </LocalizedLink>
    </div>
  );
};

export default RecipeExtractorBadge;
