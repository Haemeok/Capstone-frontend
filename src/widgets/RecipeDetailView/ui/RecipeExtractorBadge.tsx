"use client";

import { LocalizedLink, useT } from "@/shared/i18n";
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
  const t = useT();

  if (!extractor) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <BadgeButton
        badgeText={t.recipeDetail.extractorBadge}
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
