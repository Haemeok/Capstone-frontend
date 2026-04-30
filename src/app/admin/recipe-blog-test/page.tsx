"use client";

import { useCallback, useMemo, useState } from "react";

import { Square } from "lucide-react";

import { getRecipe } from "@/entities/recipe/model/api";
import type {
  DetailedRecipeGridItem,
  Recipe,
} from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user/model/store";

import { CostSummary } from "@/app/admin/image-quality-test/components/CostSummary";
import { RecipeSearchPanel } from "@/app/admin/image-quality-test/components/RecipeSearchPanel";
import {
  type CostHistory,
  loadCostHistory,
  resetCostHistory,
} from "@/app/admin/image-quality-test/lib/costStorage";
import { getModelById } from "@/app/admin/image-quality-test/lib/models";

import { SequenceGallery } from "./components/SequenceGallery";
import { buildSequencePrompts } from "./lib/buildSequencePrompts";
import { saveSequenceImages, type SaveItem } from "./lib/saveSequenceImages";
import { SEQUENCE_MODEL_IDS } from "./lib/types";
import { useSequenceGenerate } from "./lib/useSequenceGenerate";

const ADMIN_USER_ID = "X1BoaJNZ";
const EMPTY_HISTORY: CostHistory = { byModel: {}, totalCount: 0, totalCost: 0 };
const COST_CONFIRM_THRESHOLD_USD = 2;
const PRIMARY_MODEL_ID = "gpt-image-2-low" as const;
const FILE_NAME_UNSAFE = /[\\/:*?"<>|]/g;

const RecipeBlogTestPage = () => {
  const user = useUserStore((s) => s.user);
  const isAuthReady = useUserStore((s) => s.isAuthReady);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [history, setHistory] = useState<CostHistory>(() =>
    typeof window === "undefined" ? EMPTY_HISTORY : loadCostHistory()
  );

  const { results, running, generate, retry, cancel } = useSequenceGenerate();

  const sequence = useMemo(
    () => (recipe ? buildSequencePrompts(recipe) : []),
    [recipe]
  );

  const estimatedCost = useMemo(() => {
    const perPromptCost = SEQUENCE_MODEL_IDS.reduce((sum, id) => {
      const m = getModelById(id);
      return sum + (m?.pricePerImage ?? 0);
    }, 0);
    return perPromptCost * sequence.length;
  }, [sequence.length]);

  const handleSelectRecipe = useCallback(
    async (r: DetailedRecipeGridItem) => {
      setRecipeLoading(true);
      try {
        const full = await getRecipe(r.id);
        setRecipe(full);
      } catch (err) {
        console.error("레시피 상세 조회 실패:", err);
        setRecipe(null);
      } finally {
        setRecipeLoading(false);
      }
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    if (sequence.length === 0) return;
    if (estimatedCost > COST_CONFIRM_THRESHOLD_USD) {
      const ok = window.confirm(
        `예상 비용이 $${estimatedCost.toFixed(2)}입니다. 계속할까요?`
      );
      if (!ok) return;
    }
    await generate(sequence);
    setHistory(loadCostHistory());
  }, [sequence, estimatedCost, generate]);

  const handleResetCost = useCallback(() => {
    resetCostHistory();
    setHistory(EMPTY_HISTORY);
  }, []);

  const successCount = useMemo(
    () =>
      sequence.filter(
        (img) => results[img.id]?.[PRIMARY_MODEL_ID]?.status === "success"
      ).length,
    [sequence, results]
  );

  const handleSaveAll = useCallback(async () => {
    if (!recipe || successCount === 0) return;

    const items: SaveItem[] = sequence
      .map((img, idx) => {
        const cell = results[img.id]?.[PRIMARY_MODEL_ID];
        if (!cell || cell.status !== "success") return null;
        const seq = String(idx + 1).padStart(2, "0");
        const safeId = img.id.replace(FILE_NAME_UNSAFE, "_");
        return { imageUrl: cell.imageUrl, fileName: `${seq}-${safeId}.png` };
      })
      .filter((x): x is SaveItem => x !== null);

    const safeTitle = recipe.title.replace(FILE_NAME_UNSAFE, "_");
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const folderName = `recipe-blog-${safeTitle}-${today}`;

    try {
      await saveSequenceImages(items, folderName);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("이미지 저장 실패:", err);
      window.alert(
        `저장 실패: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }, [recipe, sequence, results, successCount]);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!user || user.id !== ADMIN_USER_ID) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">접근 권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-beige-light/40 p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">
        레시피 블로그 이미지 시퀀스 (관리자)
      </h1>

      <div className="mb-4">
        <RecipeSearchPanel
          selectedId={recipe?.id ?? null}
          onSelect={handleSelectRecipe}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-xs text-gray-700">
            <p className="font-semibold text-gray-900">사용 모델 (고정)</p>
            <ul className="mt-1 list-disc pl-4">
              <li>GPT Image 2 Low ($0.006/img)</li>
            </ul>
          </div>

          <CostSummary history={history} onReset={handleResetCost} />
        </aside>

        <main className="space-y-4">
          {recipeLoading && (
            <p className="text-sm text-gray-500">레시피 상세 조회 중…</p>
          )}

          {recipe && !recipeLoading && (
            <>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">선택된 레시피</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {recipe.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    이미지 {sequence.length}장 · 예상 비용 ≈ ${estimatedCost.toFixed(2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={running || sequence.length === 0}
                  className="h-12 rounded-2xl bg-olive-light px-6 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {running ? "생성 중…" : "생성하기"}
                </button>
                {running && (
                  <button
                    type="button"
                    onClick={cancel}
                    className="flex h-12 items-center gap-2 rounded-2xl border-2 border-red-200 bg-white px-4 text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    <Square className="h-4 w-4 fill-red-500" /> 취소
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={running || successCount === 0}
                  className="h-12 rounded-2xl border-2 border-olive-light bg-white px-4 text-sm font-medium text-olive-light transition active:scale-[0.98] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
                >
                  전부 저장 ({successCount})
                </button>
              </div>

              <SequenceGallery
                sequence={sequence}
                results={results}
                onRetry={retry}
              />
            </>
          )}

          {!recipe && !recipeLoading && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-400">
              상단 검색에서 레시피를 먼저 선택하세요
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecipeBlogTestPage;
