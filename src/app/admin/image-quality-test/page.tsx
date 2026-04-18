"use client";

import { useCallback, useState } from "react";

import { Square } from "lucide-react";

import { getRecipe } from "@/entities/recipe/model/api";
import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user/model/store";

import { ComparisonGrid } from "./components/ComparisonGrid";
import { CostSummary } from "./components/CostSummary";
import { ModelTogglePanel } from "./components/ModelTogglePanel";
import { PromptEditor } from "./components/PromptEditor";
import { RecipeSearchPanel } from "./components/RecipeSearchPanel";
import { buildPrompt } from "./lib/buildPrompt";
import type { CostHistory } from "./lib/costStorage";
import { loadCostHistory, resetCostHistory } from "./lib/costStorage";
import { useImageTest } from "./lib/useImageTest";

const ADMIN_USER_ID = "X1BoaJNZ";
const EMPTY_HISTORY: CostHistory = { byModel: {}, totalCount: 0, totalCost: 0 };

const ImageQualityTestPage = () => {
  const user = useUserStore((state) => state.user);
  const isAuthReady = useUserStore((state) => state.isAuthReady);

  const [recipe, setRecipe] = useState<DetailedRecipeGridItem | null>(null);
  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);
  const [enabledIds, setEnabledIds] = useState<string[]>([]);
  const [history, setHistory] = useState<CostHistory>(() =>
    typeof window === "undefined" ? EMPTY_HISTORY : loadCostHistory()
  );

  const { results, running, runAll, retry, cancel } = useImageTest();

  const refreshHistory = useCallback(() => {
    setHistory(loadCostHistory());
  }, []);

  const handleRecipeSelect = useCallback(async (r: DetailedRecipeGridItem) => {
    setRecipe(r);
    setPromptLoading(true);
    setPrompt("레시피 상세 조회 중...");
    try {
      const detail = await getRecipe(r.id);
      setPrompt(
        buildPrompt({
          title: detail.title,
          description: detail.description,
          dishType: detail.dishType,
          ingredients: detail.ingredients,
          steps: detail.steps,
          fineDiningInfo: detail.fineDiningInfo,
        })
      );
    } catch (err) {
      console.error("레시피 상세 조회 실패:", err);
      setPrompt(buildPrompt({ title: r.title }));
    } finally {
      setPromptLoading(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt || enabledIds.length === 0) return;
    await runAll(enabledIds, prompt);
    refreshHistory();
  }, [prompt, enabledIds, runAll, refreshHistory]);

  const handleRetry = useCallback(
    async (modelId: string) => {
      await retry(modelId, prompt);
      refreshHistory();
    },
    [retry, prompt, refreshHistory]
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
      <h1 className="mb-4 text-2xl font-bold text-gray-900">이미지 생성 모델 비교</h1>

      {/* 검색: 전체 너비로 배치해 여러 결과를 한번에 볼 수 있게 */}
      <div className="mb-4">
        <RecipeSearchPanel selectedId={recipe?.id ?? null} onSelect={handleRecipeSelect} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <ModelTogglePanel onChange={setEnabledIds} />
          <CostSummary history={history} onReset={handleResetCost} />
        </aside>

        <main className="space-y-4">
          {recipe ? (
            <>
              <PromptEditor value={prompt} onChange={setPrompt} />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={running || enabledIds.length === 0 || prompt.length === 0 || promptLoading}
                  className="h-12 rounded-2xl bg-olive-light px-6 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {running ? "생성 중…" : `생성 (${enabledIds.length}개 모델)`}
                </button>
                {running && (
                  <button
                    onClick={cancel}
                    className="flex h-12 items-center gap-2 rounded-2xl border-2 border-red-200 bg-white px-4 text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    <Square className="h-4 w-4 fill-red-500" /> 취소
                  </button>
                )}
              </div>
              <ComparisonGrid enabledIds={enabledIds} results={results} onRetry={handleRetry} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-400">
              상단 검색에서 레시피를 먼저 선택하세요
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ImageQualityTestPage;
