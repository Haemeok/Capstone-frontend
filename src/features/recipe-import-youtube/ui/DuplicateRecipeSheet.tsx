"use client";

import { useState } from "react";

import { useCommonDict, useYoutubeDict } from "@/shared/i18n";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { DuplicateRecipeActions } from "./DuplicateRecipeActions";
import { DuplicateRecipeEmbeddedContent } from "./DuplicateRecipeEmbeddedContent";
import { DuplicateRecipeSheetSkeleton } from "./DuplicateRecipeSheetSkeleton";
import { DuplicateRecipeSummary } from "./DuplicateRecipeSummary";

type DuplicateRecipeSheetProps = {
  recipeId: string;
  recipeItem: DetailedRecipeGridItem | null;
  isLoading: boolean;
  isFavorited: boolean;
  wasAutoSaved: boolean;
  onSaveClick: () => void;
  isEmbedded?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const DuplicateRecipeSheet = ({
  recipeId,
  recipeItem,
  isLoading,
  isFavorited,
  wasAutoSaved,
  onSaveClick,
  isEmbedded = false,
  open,
  onOpenChange,
}: DuplicateRecipeSheetProps) => {
  const [internalOpen, setInternalOpen] = useState(true);
  const common = useCommonDict();
  const t = useYoutubeDict();
  const { isMobile, Container, Content, Header, Title, Description, Footer } =
    useResponsiveSheet();
  const resolvedOpen = open ?? internalOpen;
  const handleOpenChange = onOpenChange ?? setInternalOpen;

  if (isEmbedded) {
    return (
      <DuplicateRecipeEmbeddedContent
        recipeId={recipeId}
        recipeItem={recipeItem}
        isLoading={isLoading}
        isFavorited={isFavorited}
        wasAutoSaved={wasAutoSaved}
        onSaveClick={onSaveClick}
      />
    );
  }

  const contentClassName = isMobile
    ? "max-h-[90dvh] w-full rounded-t-3xl data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=bottom]:rounded-t-3xl data-[vaul-drawer-direction=bottom]:border-0"
    : "max-h-[calc(100dvh-2rem)] w-full max-w-md rounded-2xl sm:max-w-md";

  return (
    <Container open={resolvedOpen} onOpenChange={handleOpenChange}>
      <Content
        hasDescription
        closeLabel={common.actions.close}
        className={`flex flex-col overflow-hidden border-0 bg-white p-0 shadow-xl ${contentClassName}`}
      >
        <Header className="relative shrink-0 px-5 pt-5 pr-16 pb-4 text-left">
          <Title className="text-ink text-left text-xl leading-7 font-bold">
            {t.duplicateTitle}
          </Title>
          <Description className="text-left text-sm leading-5 font-medium">
            <span className="text-olive-dark block">{t.duplicateNoCredit}</span>
            {wasAutoSaved ? (
              <span className="text-ink-sub mt-1 block">
                {t.duplicateAdded}
              </span>
            ) : null}
          </Description>
        </Header>

        {isLoading && recipeItem === null ? (
          <DuplicateRecipeSheetSkeleton isMobile={isMobile} />
        ) : recipeItem ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DuplicateRecipeSummary
                isMobile={isMobile}
                recipeItem={recipeItem}
              />
            </div>
            <Footer
              className={`grid shrink-0 gap-2 bg-white px-5 pt-2 pb-4 sm:grid ${isFavorited ? "grid-cols-1" : "grid-cols-[1fr_1.6fr]"}`}
            >
              <DuplicateRecipeActions
                recipeId={recipeId}
                isFavorited={isFavorited}
                onSaveClick={onSaveClick}
              />
            </Footer>
          </>
        ) : null}
      </Content>
    </Container>
  );
};
