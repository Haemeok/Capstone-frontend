"use client";

import { useState } from "react";

import { Bookmark, X } from "lucide-react";

import { LocalizedLink, useCommonDict, useYoutubeDict } from "@/shared/i18n";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";

import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import { DuplicateRecipeSheetSkeleton } from "./DuplicateRecipeSheetSkeleton";
import { DuplicateRecipeSummary } from "./DuplicateRecipeSummary";

type DuplicateRecipeSheetProps = {
  recipeId: string;
  recipeItem: DetailedRecipeGridItem | null;
  isLoading: boolean;
  isFavorited: boolean;
  onSaveClick: () => void;
};

type DuplicateRecipeActionsProps = Pick<
  DuplicateRecipeSheetProps,
  "recipeId" | "isFavorited" | "onSaveClick"
>;

const actionFocusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-dark";

const DuplicateRecipeActions = ({
  recipeId,
  isFavorited,
  onSaveClick,
}: DuplicateRecipeActionsProps) => {
  const common = useCommonDict();
  const t = useYoutubeDict();

  return (
    <>
      {isFavorited ? (
        <p className="text-ink-sub text-center text-sm font-medium">
          {t.duplicateAlreadySaved}
        </p>
      ) : (
        <button
          type="button"
          aria-label={t.duplicateSaveButton}
          onClick={onSaveClick}
          className={`text-ink-sub flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 text-sm font-semibold transition-colors active:bg-gray-200 ${actionFocusClass}`}
        >
          <Bookmark aria-hidden="true" className="h-5 w-5 shrink-0" />
          {common.actions.save}
        </button>
      )}

      <LocalizedLink
        href={`/recipes/${recipeId}`}
        className={`bg-olive-light active:bg-olive-dark flex h-12 cursor-pointer items-center justify-center rounded-xl px-4 text-center text-base font-bold text-white transition-colors ${actionFocusClass}`}
      >
        {t.duplicateViewButton}
      </LocalizedLink>
    </>
  );
};

export const DuplicateRecipeSheet = ({
  recipeId,
  recipeItem,
  isLoading,
  isFavorited,
  onSaveClick,
}: DuplicateRecipeSheetProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const common = useCommonDict();
  const t = useYoutubeDict();
  const { isMobile, Container, Content, Header, Title, Description, Footer } =
    useResponsiveSheet();

  const contentClassName = isMobile
    ? "max-h-[90dvh] w-full rounded-t-3xl data-[vaul-drawer-direction=bottom]:max-h-[90dvh] data-[vaul-drawer-direction=bottom]:rounded-t-3xl data-[vaul-drawer-direction=bottom]:border-0"
    : "max-h-[calc(100dvh-2rem)] w-full max-w-md rounded-2xl sm:max-w-md";

  return (
    <Container open={isOpen} onOpenChange={setIsOpen}>
      <Content
        hasDescription
        className={`flex flex-col overflow-hidden border-0 bg-white p-0 shadow-xl [&>[data-slot=dialog-close]]:hidden [&>button]:hidden ${contentClassName}`}
      >
        <Header className="relative shrink-0 px-5 pt-5 pr-16 pb-4 text-left">
          <Title className="text-ink text-left text-xl leading-7 font-bold">
            {t.duplicateTitle}
          </Title>
          <Description className="text-olive-dark text-left text-sm leading-5 font-medium">
            {t.duplicateNoCredit}
          </Description>
          <button
            type="button"
            aria-label={common.actions.close}
            onClick={() => setIsOpen(false)}
            className={`text-ink-sub absolute top-2.5 right-2.5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-gray-100 ${actionFocusClass}`}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
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
              className={`grid shrink-0 gap-2 border-t border-gray-100 bg-white p-4 sm:grid ${isFavorited ? "grid-cols-1" : "grid-cols-[1fr_1.6fr]"}`}
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
