"use client";

import Link from "next/link";

import { Bookmark } from "lucide-react";
import { motion } from "motion/react";

import { DetailedRecipeGridItem as DetailedRecipeGridItemType } from "@/entities/recipe/model/types";

import DetailedRecipeGridItem from "@/widgets/RecipeGrid/ui/DetailedRecipeGridItem";

type UrlSource = "direct" | "trending" | null;

const cardVariants = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};
const cardTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

type DuplicateRecipeCardProps = {
  recipeId: string;
  recipeItem: DetailedRecipeGridItemType;
  urlSource?: UrlSource;
  isFavorited: boolean;
  onSaveClick: () => void;
};

export const DuplicateRecipeCard = ({
  recipeId,
  recipeItem,
  urlSource,
  isFavorited,
  onSaveClick,
}: DuplicateRecipeCardProps) => (
  <motion.div
    key="duplicate-card"
    variants={cardVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={cardTransition}
    className="mx-auto w-full max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg"
  >
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-900">
        레시피가 이미 존재해요!
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        크레딧이 차감되지 않았어요.
        {urlSource === "direct" && (
          <>
            <br />
            저장된 레시피에 추가되었어요.
          </>
        )}
      </p>
    </div>

    <div className="mx-auto w-[180px]">
      <DetailedRecipeGridItem recipe={recipeItem} priority />
    </div>

    <div className="space-y-3">
      <Link
        href={`/recipes/${recipeId}`}
        className="bg-olive-light flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
      >
        레시피 보러가기
      </Link>

      {!isFavorited && (
        <button
          onClick={onSaveClick}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Bookmark size={18} />내 레시피에 저장하기
        </button>
      )}
    </div>

    {isFavorited && (
      <p className="text-olive-light text-center text-sm">
        이미 저장된 레시피예요
      </p>
    )}
  </motion.div>
);
