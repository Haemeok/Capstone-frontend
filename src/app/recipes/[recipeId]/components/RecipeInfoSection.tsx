import { ReactNode } from "react";

import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";
import BadgeButton from "@/shared/ui/BadgeButton";
import CollapsibleP from "@/shared/ui/CollapsibleP";

import { UserProfile } from "@/entities/user";
import { User } from "@/entities/user/model/types";

import RecipeExtractorBadge from "./RecipeExtractorBadge";

type RecipeInfoSectionProps = {
  title: string;
  aiGenerated: boolean;
  author: User;
  description: string;
  extractorId?: string | null;
  children: ReactNode;
};

export default function RecipeInfoSection({
  title,
  aiGenerated,
  author,
  description,
  extractorId,
  children,
}: RecipeInfoSectionProps) {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-center text-2xl font-bold">{title}</h1>
          {aiGenerated && (
            <BadgeButton
              badgeText="AI의 도움을 받아 작성된 레시피예요"
              badgeIcon={<AIGeneratedBadge />}
            />
          )}
        </div>

        {children}
      </section>

      {extractorId && (
        <div className="flex justify-center py-2">
          <RecipeExtractorBadge extractorId={extractorId} />
        </div>
      )}

      <section>
        <UserProfile user={author} className="text-xl" />
        <CollapsibleP content={description} />
      </section>
    </>
  );
}
