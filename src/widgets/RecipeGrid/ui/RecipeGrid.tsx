"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Pencil, Trash } from "lucide-react";

import Circle from "@/shared/ui/Circle";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";
import { Drawer, DrawerContent } from "@/shared/ui/shadcn/drawer";

import {
  BaseRecipeGridItem,
  DetailedRecipeGridItem as DetailedRecipeGridItemType,
} from "@/entities/recipe/model/types";

import useDeleteRecipeMutation from "@/features/recipe-delete/model/hooks";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";
import RecipeGridSkeleton from "@/widgets/RecipeGrid/ui/RecipeGridSkeleton";
import SimpleRecipeGridItem from "@/widgets/RecipeGrid/ui/SimpleRecipeGridItem";

type RecipeGridProps = {
  recipes: BaseRecipeGridItem[] | DetailedRecipeGridItemType[];
  isSimple?: boolean;
  hasNextPage?: boolean;
  isFetching?: boolean;
  isPending?: boolean;
  observerRef?: (node: Element | null) => void;
  noResults?: boolean;
  noResultsMessage?: string;
  lastPageMessage?: string;
  error?: Error | null;
  queryKeyString?: string;
};

const RecipeGrid = ({
  recipes,
  isSimple = false,
  hasNextPage,
  isFetching,
  isPending,
  observerRef,
  noResults,
  noResultsMessage = "표시할 레시피가 없습니다.",
  lastPageMessage = "모든 레시피를 다 봤어요!",
  error,
}: RecipeGridProps) => {
  const router = useRouter();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleOpenDrawer = (itemId: number) => {
    setSelectedItemId(itemId);
    setIsDrawerOpen(true);
  };
  const handleDrawerState = (state: boolean) => {
    setIsDrawerOpen(state);
    setSelectedItemId(null);
  };

  const handleEdit = () => {
    router.push(`/recipes/${selectedItemId}/edit`);
  };

  const handleDeleteModalOpen = () => {
    setIsDrawerOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    deleteRecipe();
  };

  const { mutate: deleteRecipe } = useDeleteRecipeMutation(selectedItemId ?? 0);

  if (isPending) {
    return (
      <div className="p-4">
        <div
          className="grid gap-4
            [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]
            sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]
            md:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]
            lg:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]"
        >
          <RecipeGridSkeleton count={6} isSimple={isSimple} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-base text-red-500">
        {error.message || "오류가 발생했습니다. 다시 시도해주세요."}
      </p>
    );
  }

  if (noResults || !recipes || recipes.length === 0) {
    return (
      <p className="py-10 text-center text-base text-gray-500">
        {noResultsMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col p-4">
      <div
        className="grid gap-4
          [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]
          sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]
          md:[grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]
          lg:[grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]"
      >
        {recipes.map((recipe, index) =>
          isSimple ? (
            <SimpleRecipeGridItem
              key={recipe.id}
              recipe={recipe as BaseRecipeGridItem}
              setIsDrawerOpen={handleOpenDrawer}
              priority={index === 0}
            />
          ) : (
            <DetailedRecipeGridItem
              key={recipe.id}
              recipe={recipe as DetailedRecipeGridItemType}
              priority={index === 0}
            />
          )
        )}
      </div>
      <div
        ref={observerRef}
        className="mt-2 flex h-10 items-center justify-center"
      >
        {!isFetching &&
          !hasNextPage &&
          recipes &&
          recipes.length > 0 &&
          !error &&
          !noResults && (
            <p className="text-sm text-gray-500">{lastPageMessage}</p>
          )}
      </div>

      {isFetching && (
        <div className="flex items-center justify-center py-5">
          <Circle className="text-olive-light h-10 w-10" />
        </div>
      )}

      {isDrawerOpen && (
        <Drawer open={isDrawerOpen} onOpenChange={handleDrawerState}>
          <DrawerContent className="p-4">
            <div className="absolute top-2 left-1/2 flex h-1 w-10 -translate-x-1/2 rounded-2xl bg-slate-400" />
            <div className="flex flex-col gap-2 rounded-2xl bg-gray-100 p-4">
              <button
                className="flex w-full justify-between"
                onClick={handleEdit}
              >
                <p>수정</p>
                <Pencil size={20} />
              </button>
              <div className="h-px w-full bg-gray-300" />
              <button
                className="flex w-full justify-between text-red-500"
                onClick={handleDeleteModalOpen}
              >
                <p>삭제</p>
                <Trash size={20} />
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          title="레시피를 삭제하시겠어요?"
          onConfirm={handleDelete}
          description="이 레시피를 삭제하면 복원할 수 없습니다."
        />
      )}
    </div>
  );
};

export default RecipeGrid;
