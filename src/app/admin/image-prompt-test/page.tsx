"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

import { PromptVariantCard } from "./components/PromptVariantCard";
import { PROMPT_VARIANTS } from "./lib/promptVariants";
import { usePromptCompare, type VariantRun } from "./lib/usePromptCompare";

const ADMIN_USER_ID = "X1BoaJNZ";
const FIXED_MODEL_ID = "gpt-image-2-low" as const;
const EMPTY_HISTORY: CostHistory = { byModel: {}, totalCount: 0, totalCost: 0 };

const ImagePromptTestPage = () => {
  const user = useUserStore((s) => s.user);
  const isAuthReady = useUserStore((s) => s.isAuthReady);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [prompts, setPrompts] = useState<Record<string, string>>(
    Object.fromEntries(PROMPT_VARIANTS.map((v) => [v.id, ""]))
  );
  const [history, setHistory] = useState<CostHistory>(() =>
    typeof window === "undefined" ? EMPTY_HISTORY : loadCostHistory()
  );

  const { results, running, runAll, retry, cancel } =
    usePromptCompare(FIXED_MODEL_ID);

  const model = getModelById(FIXED_MODEL_ID);
  const pricePerImage = model?.pricePerImage ?? 0;

  const filledCount = useMemo(
    () =>
      PROMPT_VARIANTS.reduce(
        (n, v) => n + (prompts[v.id]?.trim().length > 0 ? 1 : 0),
        0
      ),
    [prompts]
  );
  const estimatedCost = filledCount * pricePerImage;

  const handleSelectRecipe = useCallback(async (r: DetailedRecipeGridItem) => {
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
  }, []);

  // Auto-fill non-placeholder prompts when a new recipe is selected.
  useEffect(() => {
    if (!recipe) return;
    setPrompts((prev) => {
      const next = { ...prev };
      for (const v of PROMPT_VARIANTS) {
        if (v.isPlaceholder) continue;
        next[v.id] = v.build(recipe);
      }
      return next;
    });
  }, [recipe]);

  const handlePromptChange = useCallback(
    (variantId: string, value: string) => {
      setPrompts((prev) => ({ ...prev, [variantId]: value }));
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    const runs: VariantRun[] = PROMPT_VARIANTS
      .map((v) => ({ variantId: v.id, prompt: prompts[v.id] ?? "" }))
      .filter((r) => r.prompt.trim().length > 0);
    if (runs.length === 0) return;

    await runAll(runs);
    setHistory(loadCostHistory());
  }, [prompts, runAll]);

  const handleRetry = useCallback(
    async (variantId: string) => {
      const prompt = prompts[variantId] ?? "";
      if (prompt.trim().length === 0) return;
      await retry(variantId, prompt);
      setHistory(loadCostHistory());
    },
    [prompts, retry]
  );

  const handleResetCost = useCallback(() => {
    resetCostHistory();
    setHistory(EMPTY_HISTORY);
  }, []);

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
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        프롬프트 비교 (gpt-image-2 low 고정)
      </h1>
      <p className="mb-4 text-sm text-gray-500">
        같은 레시피를 N개의 프롬프트로 한 모델에 돌려서 결과를 나란히 비교합니다.
      </p>

      <div className="mb-4">
        <RecipeSearchPanel
          selectedId={recipe?.id ?? null}
          onSelect={handleSelectRecipe}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 text-xs text-gray-700">
            <p className="font-semibold text-gray-900">고정 모델</p>
            <p className="mt-1">
              GPT Image 2 Low (${pricePerImage.toFixed(3)}/img)
            </p>
            <p className="mt-2 text-gray-500">
              채워진 슬롯: {filledCount} / {PROMPT_VARIANTS.length}
            </p>
            <p className="text-gray-500">
              예상 비용: ${estimatedCost.toFixed(3)}
            </p>
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
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={running || filledCount === 0}
                  className="h-12 rounded-2xl bg-olive-light px-6 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {running
                    ? "생성 중…"
                    : `생성하기 (${filledCount}개 프롬프트)`}
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
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {recipe.imageUrl && (
                  <div className="overflow-hidden rounded-2xl border-2 border-olive-light bg-white shadow-sm">
                    <div className="aspect-square w-full bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-bold text-olive-light">
                        원본 레시피 이미지
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {recipe.title}
                      </p>
                    </div>
                  </div>
                )}
                {PROMPT_VARIANTS.map((v) => (
                  <PromptVariantCard
                    key={v.id}
                    variant={v}
                    prompt={prompts[v.id] ?? ""}
                    onPromptChange={(next) => handlePromptChange(v.id, next)}
                    result={results[v.id] ?? { status: "idle" }}
                    onRetry={() => handleRetry(v.id)}
                    disabled={running}
                  />
                ))}
              </div>
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

export default ImagePromptTestPage;
