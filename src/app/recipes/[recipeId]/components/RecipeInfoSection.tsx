import { ReactNode } from "react";

import BadgeButton from "@/shared/ui/BadgeButton";
import CollapsibleP from "@/shared/ui/CollapsibleP";
import Box from "@/shared/ui/primitives/Box";

import { UserProfile } from "@/entities/user";
import { User } from "@/entities/user/model/types";
import AIGeneratedBadge from "@/shared/ui/badge/AIGeneratedBadge";

type RecipeInfoSectionProps = {
  title: string;
  aiGenerated: boolean;
  author: User;
  description: string;
  children: ReactNode;
};

export default function RecipeInfoSection({
  title,
  aiGenerated,
  author,
  description,
  children,
}: RecipeInfoSectionProps) {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-3">
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

      <section>
        <UserProfile user={author} className="text-xl" />
        <CollapsibleP content={description} />
      </section>
    </>
  );
}
