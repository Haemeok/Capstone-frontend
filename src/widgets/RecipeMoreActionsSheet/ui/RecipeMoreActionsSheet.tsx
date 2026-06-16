"use client";

import Link from "next/link";

import { useCommonDict } from "@/shared/i18n";
import { useResponsiveSheet } from "@/shared/lib/hooks/useResponsiveSheet";
import { PencilIcon } from "@/shared/ui/icons";
import { DialogTitle } from "@/shared/ui/shadcn/dialog";

import { DeleteRowAction } from "@/features/recipe-delete";
import { VisibilityRowAction } from "@/features/recipe-visibility";

type SheetTarget = {
  id: string;
  isPrivate: boolean;
};

type RecipeMoreActionsSheetProps = {
  target: SheetTarget | null;
  onOpenChange: (open: boolean) => void;
};

const RecipeMoreActionsSheet = ({
  target,
  onOpenChange,
}: RecipeMoreActionsSheetProps) => {
  const t = useCommonDict();
  const { isMobile, Container, Content } = useResponsiveSheet();

  if (!target) return null;

  const variant = isMobile ? "mobile" : "desktop";

  const dividerClass = isMobile
    ? "h-px w-full bg-gray-300"
    : "h-px w-full bg-gray-200";

  return (
    <Container open onOpenChange={onOpenChange}>
      <Content className={isMobile ? "p-4" : ""}>
        <DialogTitle className="sr-only">{t.actions.recipeOptions}</DialogTitle>
        {isMobile && (
          <div className="absolute top-2 left-1/2 flex h-1 w-10 -translate-x-1/2 rounded-2xl bg-slate-400" />
        )}
        <div
          className={
            isMobile
              ? "flex flex-col gap-2 rounded-2xl bg-gray-100 p-4"
              : "flex flex-col gap-0"
          }
        >
          <Link
            href={`/recipes/${target.id}/edit`}
            className={
              isMobile
                ? "flex w-full cursor-pointer justify-between"
                : "flex w-full cursor-pointer justify-center gap-2 px-6 py-4 transition-colors hover:bg-gray-50"
            }
          >
            {!isMobile && <PencilIcon size={20} />}
            <p>{t.actions.edit}</p>
            {isMobile && <PencilIcon size={20} />}
          </Link>
          <div className={dividerClass} />
          <VisibilityRowAction
            recipeId={target.id}
            isPrivate={target.isPrivate}
            variant={variant}
            onAfterToggle={() => onOpenChange(false)}
          />
          <div className={dividerClass} />
          <DeleteRowAction recipeId={target.id} variant={variant} />
        </div>
      </Content>
    </Container>
  );
};

export default RecipeMoreActionsSheet;
