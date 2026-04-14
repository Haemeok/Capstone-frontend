// src/app/admin/card-news/components/RecipeSelector.tsx
"use client";

import { useCallback, useEffect, useState } from "react";

import { getRecipe, getRecipeItems } from "@/entities/recipe/model/api";
import { DetailedRecipeGridItem, Recipe } from "@/entities/recipe/model/types";

type RecipeSelectorProps = {
  query: string;
  onComplete: (thumbnail: Recipe, cards: Recipe[]) => void;
};

export const RecipeSelector = ({ query, onComplete }: RecipeSelectorProps) => {
  const [recipes, setRecipes] = useState<DetailedRecipeGridItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  const [cardIds, setCardIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const res = await getRecipeItems({ q: query, sort: "likeCount,desc", size: 30 });
        setRecipes(res.content);
      } catch (err) {
        console.error("레시피 검색 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [query]);

  const toggleCard = useCallback((id: string) => {
    setCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleComplete = async () => {
    if (!thumbnailId || cardIds.size === 0) return;
    setSubmitting(true);
    try {
      const allIds = [thumbnailId, ...Array.from(cardIds).filter((id) => id !== thumbnailId)];
      const fullRecipes = await Promise.all(allIds.map((id) => getRecipe(id)));
      const thumbnail = fullRecipes[0];
      const cards = fullRecipes.slice(1);
      onComplete(thumbnail, cards);
    } catch (err) {
      console.error("레시피 상세 조회 실패:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-400">레시피 검색 중...</div>;
  }

  if (recipes.length === 0) {
    return <div className="py-12 text-center text-gray-400">검색 결과가 없습니다.</div>;
  }

  return (
    <div>
      <p className="mb-2 text-sm text-gray-500">
        &ldquo;{query}&rdquo; 검색 결과 {recipes.length}개
      </p>

      {/* 선택 상태 */}
      <div className="mb-4 flex items-center gap-4 text-sm">
        <span className="text-gray-600">
          썸네일: {thumbnailId ? "✓ 선택됨" : "미선택"}
        </span>
        <span className="text-gray-600">
          카드: {cardIds.size}개 선택
        </span>
        <button
          onClick={handleComplete}
          disabled={!thumbnailId || cardIds.size === 0 || submitting}
          className="ml-auto rounded-xl bg-olive-light px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          {submitting ? "로딩..." : "다음 단계 →"}
        </button>
      </div>

      {/* 가로 스크롤 그리드 */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {recipes.map((recipe) => {
          const isThumbnail = thumbnailId === recipe.id;
          const isCard = cardIds.has(recipe.id);

          return (
            <div
              key={recipe.id}
              className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
                isThumbnail
                  ? "border-blue-500 shadow-lg"
                  : isCard
                    ? "border-olive-light shadow-md"
                    : "border-transparent hover:border-gray-200"
              }`}
              style={{ width: 180 }}
            >
              {/* 이미지 */}
              <div className="relative aspect-[4/5]">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="h-full w-full object-cover"
                />
                {/* 배지 */}
                {isThumbnail && (
                  <div className="absolute left-2 top-2 rounded-lg bg-blue-500 px-2 py-1 text-xs font-bold text-white">
                    썸네일
                  </div>
                )}
                {isCard && !isThumbnail && (
                  <div className="absolute left-2 top-2 rounded-lg bg-olive-light px-2 py-1 text-xs font-bold text-white">
                    카드
                  </div>
                )}
              </div>

              {/* 제목 */}
              <div className="p-2">
                <p className="truncate text-sm font-medium text-gray-900">{recipe.title}</p>
              </div>

              {/* 선택 버튼 */}
              <div className="flex border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnailId(recipe.id);
                  }}
                  className={`flex-1 py-1.5 text-xs font-medium ${
                    isThumbnail ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  썸네일
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCard(recipe.id);
                  }}
                  className={`flex-1 border-l border-gray-100 py-1.5 text-xs font-medium ${
                    isCard ? "bg-olive-light/10 text-olive-light" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  카드
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
