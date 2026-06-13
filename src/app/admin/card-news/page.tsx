"use client";

import { useCallback, useState } from "react";

import { getRecipe } from "@/entities/recipe/model/api";
import { Recipe } from "@/entities/recipe/model/types";

import { AdminSearchFilters } from "./components/AdminSearchFilters";
import { CardEditor } from "./components/CardEditor";
import { RecipeResults } from "./components/RecipeResults";

type SelectedRecipes = {
  thumbnail: Recipe;
  cards: Recipe[];
};

const CardNewsPage = () => {
  const [filter, setFilter] = useState<Record<string, unknown>>({});
  const [thumbnailId, setThumbnailId] = useState<string | null>(null);
  const [cardIds, setCardIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<SelectedRecipes | null>(null);
  const [loadingSelection, setLoadingSelection] = useState(false);

  const handleToggleCard = useCallback((id: string) => {
    setCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleLoadEditor = async () => {
    if (!thumbnailId || cardIds.size === 0) return;
    setLoadingSelection(true);
    try {
      const allIds = [
        thumbnailId,
        ...Array.from(cardIds).filter((id) => id !== thumbnailId),
      ];
      const full = await Promise.all(allIds.map((id) => getRecipe(id)));
      setSelected({ thumbnail: full[0], cards: full.slice(1) });
    } catch (err) {
      console.error("레시피 상세 조회 실패:", err);
    } finally {
      setLoadingSelection(false);
    }
  };

  const canLoad = !!thumbnailId && cardIds.size > 0;

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-white p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">카드뉴스 생성기</h1>

      <section className="mb-8">
        <AdminSearchFilters
          onSearch={(params) => {
            setFilter(params);
            setThumbnailId(null);
            setCardIds(new Set());
            setSelected(null);
          }}
        />
      </section>

      {Object.keys(filter).length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              썸네일: {thumbnailId ? "✓ 선택됨" : "미선택"}
            </span>
            <span className="text-gray-600">카드: {cardIds.size}개 선택</span>
            <button
              onClick={handleLoadEditor}
              disabled={!canLoad || loadingSelection}
              className="bg-olive-light ml-auto cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loadingSelection ? "로딩..." : "선택 확정 → 에디터"}
            </button>
          </div>
          <RecipeResults
            filter={filter}
            thumbnailId={thumbnailId}
            cardIds={cardIds}
            onSelectThumbnail={setThumbnailId}
            onToggleCard={handleToggleCard}
          />
        </section>
      )}

      {selected && (
        <section>
          <CardEditor
            filter={filter}
            thumbnail={selected.thumbnail}
            recipes={selected.cards}
          />
        </section>
      )}
    </div>
  );
};

export default CardNewsPage;
