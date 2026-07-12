import { ReactNode } from "react";

import type { Locale } from "@/shared/i18n";
import { getDictionary } from "@/shared/i18n";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import BadgeButton from "@/shared/ui/BadgeButton";
import CollapsibleP from "@/shared/ui/CollapsibleP";

import type { CreatorCountryTag } from "@/entities/recipe";
import { CreatorCountryFlag } from "@/entities/recipe";
import {
  getOfficialProfileOverride,
  UserName,
  UserProfileImage,
} from "@/entities/user";
import { User } from "@/entities/user/model/types";

import RecipeExtractorBadge from "./RecipeExtractorBadge";

type RecipeInfoSectionProps = {
  title: string;
  aiGenerated: boolean;
  author: User;
  description?: string;
  extractorId?: string | null;
  creatorCountryTag?: CreatorCountryTag | null;
  locale: Locale;
  children: ReactNode;
};

export default function RecipeInfoSection({
  title,
  aiGenerated,
  author,
  description,
  extractorId,
  creatorCountryTag,
  locale,
  children,
}: RecipeInfoSectionProps) {
  const t = getDictionary(locale);

  const officialProfile = getOfficialProfileOverride(author.id, locale);
  const authorNickname = officialProfile?.nickname ?? author.nickname;
  const authorIntroduction =
    officialProfile?.introduction ?? author.introduction;

  return (
    <>
      <section className="rise-in flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-center text-2xl font-bold text-pretty break-keep">
            <CreatorCountryFlag
              tag={creatorCountryTag}
              className="mr-1.5 inline-flex align-middle"
            />
            {title}
          </h1>
          {aiGenerated && (
            <BadgeButton
              badgeText={
                extractorId
                  ? t.recipeDetail.aiYoutubeBadge
                  : t.recipeDetail.aiAssistedBadge
              }
              badgeIcon={<AIGeneratedBadge />}
            />
          )}
        </div>

        {children}
      </section>

      {extractorId && (
        <div className="rise-in rise-d1 flex justify-center py-2">
          <RecipeExtractorBadge extractorId={extractorId} />
        </div>
      )}

      <section className="rise-in rise-d1 flex items-center gap-3 py-3 md:gap-4">
        <UserProfileImage
          profileImage={author.profileImage ?? ""}
          userId={author.id}
          className="h-11 w-11 md:h-14 md:w-14"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <UserName
            username={authorNickname}
            userId={author.id}
            className="text-ink text-base font-bold md:text-lg"
          />
          {authorIntroduction && (
            <p className="text-ink-muted mt-0.5 truncate text-xs leading-5 md:text-sm md:leading-6">
              {authorIntroduction}
            </p>
          )}
        </div>
      </section>

      {description && (
        <div className="rise-in rise-d2">
          <CollapsibleP content={description} />
        </div>
      )}
    </>
  );
}
