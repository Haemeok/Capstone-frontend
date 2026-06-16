"use client";

import { useState } from "react";
import Link from "next/link";

import { Pencil, Wand2 } from "lucide-react";

import { useLocalizedRouter } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { Visibility } from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user";

import { RecipeSaveButton } from "@/features/recipe-save";
import { useRecipeStatus } from "@/features/recipe-status";
import { LockButton } from "@/features/recipe-visibility";

import { useLoginEncourageDrawerStore } from "@/widgets/LoginEncourageDrawer/model/store";
import ShareButton from "@/widgets/ShareButton";

import {
  markRemixOnboarded,
  RemixOnboardingTooltip,
} from "./RemixOnboardingTooltip";

type RecipeInteractionButtonsProps = {
  recipeId: string;
  initialIsFavorite: boolean;
  visibility?: Visibility;
  title: string;
  authorId: string;
  isCloneable: boolean;
};

const RecipeInteractionButtons = ({
  recipeId,
  initialIsFavorite,
  visibility,
  title,
  authorId,
  isCloneable,
}: RecipeInteractionButtonsProps) => {
  const { user } = useUserStore();
  const { status } = useRecipeStatus();
  const router = useLocalizedRouter();
  const { openDrawer } = useLoginEncourageDrawerStore();
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const isOwner = user?.id === authorId;
  const canRemix = !isOwner && isCloneable && !(status?.clonedByMe ?? false);

  const handleRemixClick = () => {
    triggerHaptic("Light");

    if (!user) {
      openDrawer({
        icon: <Wand2 size={24} className="text-olive-light" />,
        message: "이 레시피를 내 스타일로 편집해보세요!",
      });
      return;
    }

    markRemixOnboarded();
    router.push(`/recipes/${recipeId}/remix`);
  };

  const handleVisibilityChange = (next: Visibility) => {
    const target =
      next === "PRIVATE"
        ? `/recipes/private/${recipeId}`
        : `/recipes/${recipeId}`;
    router.replace(target);
  };

  return (
    <div className="flex justify-center gap-4">
      <RecipeSaveButton
        recipeId={recipeId}
        initialIsFavorite={initialIsFavorite}
        buttonClassName="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        defaultColorClass="text-ink"
        selectedColorClass="fill-dark text-ink"
        label="저장"
      />
      {isOwner && (
        <div className="flex flex-col items-center">
          <Link
            href={`/recipes/${recipeId}/edit`}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
            aria-label="레시피 수정"
            onClick={() => triggerHaptic("Light")}
          >
            <Pencil width={24} height={24} />
          </Link>
          <p className="mt-1 text-sm font-bold">수정</p>
        </div>
      )}
      {isOwner && visibility && (
        <LockButton
          recipeId={recipeId}
          visibility={visibility}
          onToggleSuccess={handleVisibilityChange}
        />
      )}
      {canRemix && (
        <RemixOnboardingTooltip
          show={!onboardingDismissed}
          onDismiss={() => setOnboardingDismissed(true)}
        >
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleRemixClick}
              aria-label="레시피 편집"
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
            >
              <Wand2 width={24} height={24} />
            </button>
            <p className="mt-1 text-sm font-bold">편집</p>
          </div>
        </RemixOnboardingTooltip>
      )}
      <ShareButton
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 p-2"
        label="공유"
        title={`${title} - 레시피오`}
        text={`${title} 레시피를 확인해보세요!`}
      />
    </div>
  );
};

export default RecipeInteractionButtons;
