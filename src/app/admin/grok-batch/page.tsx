"use client";

import React, { useState } from "react";

import { api } from "@/shared/api/client";

import { useUserStore } from "@/entities/user/model/store";

const ADMIN_USER_ID = "X1BoaJNZ";

type ImageGenerationResponse = {
  imageKey: string;
  [key: string]: any;
};

type RecipeStatus = "idle" | "loading" | "success" | "error";

interface RecipeData {
  title: string;
  dishType: string;
  description: string;
  cookingTime: number;
  cookingTools: string[];
  servings: number;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
    customPrice?: number;
    customCalories?: number;
    customCarbohydrate?: number;
    customProtein?: number;
    customFat?: number;
    customSugar?: number;
    customSodium?: number;
  }[];
  steps: {
    stepNumber: number;
    instruction: string;
    action: string;
  }[];
  tags: string[];
  marketPrice: number;
  cookingTips: string;
}

interface ParsedRecipe {
  id: string;
  title: string;
  recipeData: RecipeData;
  status: RecipeStatus;
  imageKey: string | null;
  errorMessage?: string;
}

const GrokBatchAnalyzer = () => {
  const user = useUserStore((state) => state.user);
  const isAuthReady = useUserStore((state) => state.isAuthReady);
  const [rawInput, setRawInput] = useState("");
  const [recipes, setRecipes] = useState<ParsedRecipe[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleParse = () => {
    if (!rawInput.trim()) {
      alert("JSON 배열을 입력해주세요.");
      return;
    }

    try {
      let data;

      try {
        data = JSON.parse(rawInput);
      } catch {
        data = eval(`(${rawInput})`);
      }

      if (!Array.isArray(data)) {
        data = [data];
      }

      const parsedData: ParsedRecipe[] = data.map((item, index) => ({
        id: `recipe-${Date.now()}-${index}`,
        title: item.title || `레시피 ${index + 1}`,
        recipeData: item as RecipeData,
        status: "idle",
        imageKey: null,
      }));

      if (parsedData.length === 0) {
        alert("레시피를 찾을 수 없습니다.");
        return;
      }

      setRecipes(parsedData);
    } catch (error) {
      alert(
        `JSON 파싱 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
      );
    }
  };

  const handleAnalyzeAll = async () => {
    if (recipes.length === 0) {
      alert("분석할 레시피가 없습니다.");
      return;
    }

    setIsAnalyzing(true);

    setRecipes((prev) =>
      prev.map((recipe) => ({ ...recipe, status: "loading" as RecipeStatus }))
    );

    const promises = recipes.map(async (recipe) => {
      try {
        const result = await api.post<ImageGenerationResponse>(
          "/test/ai-recipe/image",
          recipe.recipeData,
          {
            timeout: 180000,
          }
        );

        return {
          id: recipe.id,
          status: "success" as RecipeStatus,
          imageKey: result.imageKey,
          errorMessage: undefined,
        };
      } catch (error: any) {
        return {
          id: recipe.id,
          status: "error" as RecipeStatus,
          imageKey: null,
          errorMessage: error?.message || "이미지 생성 실패",
        };
      }
    });

    const results = await Promise.allSettled(promises);

    setRecipes((prev) =>
      prev.map((recipe) => {
        const resultIndex = recipes.findIndex((r) => r.id === recipe.id);
        const result = results[resultIndex];

        if (result.status === "fulfilled") {
          const value = result.value;
          return {
            ...recipe,
            status: value.status,
            imageKey: value.imageKey,
            errorMessage: value.errorMessage,
          };
        } else {
          return {
            ...recipe,
            status: "error",
            imageKey: null,
            errorMessage: result.reason?.message || "알 수 없는 오류",
          };
        }
      })
    );

    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setRawInput("");
    setRecipes([]);
  };

  const completedCount = recipes.filter((r) => r.status === "success").length;
  const errorCount = recipes.filter((r) => r.status === "error").length;

  if (!isAuthReady) {
    return <div>로딩 중...</div>;
  }

  if (!user || user.id !== ADMIN_USER_ID) {
    return <div>접근 권한이 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          🖼️ AI 이미지 생성기 (레시피 → 이미지)
        </h1>

        <section className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            레시피 JSON 입력
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="mb-4 h-48 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder='{"title": "레시피명", "ingredients": [...], "steps": [...]}'
          />
          <div className="flex gap-3">
            <button
              onClick={handleParse}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              JSON 파싱하기
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              초기화
            </button>
          </div>
        </section>

        {recipes.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-6 py-4">
            <div className="font-medium text-indigo-900">
              총 <span className="font-bold">{recipes.length}</span>개 /{" "}
              <span className="font-bold text-green-600">{completedCount}</span>
              개 완료 /{" "}
              <span className="font-bold text-red-600">{errorCount}</span>개
              실패
            </div>

            <button
              onClick={handleAnalyzeAll}
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  <span>이미지 생성 중...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>전체 이미지 생성</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="space-y-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {recipe.title}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    recipe.status === "success"
                      ? "bg-green-100 text-green-700"
                      : recipe.status === "error"
                        ? "bg-red-100 text-red-700"
                        : recipe.status === "loading"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {recipe.status === "idle" && "대기중"}
                  {recipe.status === "loading" && "생성중..."}
                  {recipe.status === "success" && "완료"}
                  {recipe.status === "error" && "오류"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="border-r border-gray-100 p-6">
                  <h4 className="mb-2 text-xs font-bold text-gray-400 uppercase">
                    Recipe Data
                  </h4>
                  <pre className="h-64 overflow-y-auto rounded bg-gray-50 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-600">
                    {JSON.stringify(recipe.recipeData, null, 2)}
                  </pre>
                </div>

                <div className="bg-slate-50 p-6">
                  <h4 className="mb-2 text-xs font-bold text-gray-400 uppercase">
                    Generated Image
                  </h4>
                  {recipe.status === "loading" ? (
                    <div className="flex h-64 animate-pulse items-center justify-center text-sm text-gray-500">
                      AI가 이미지를 생성하고 있습니다...
                    </div>
                  ) : recipe.imageKey ? (
                    <div className="flex h-64 flex-col gap-2 overflow-y-auto rounded border border-gray-200 bg-white p-3">
                      <img
                        src={`https://starwalk.space/recipio/${recipe.imageKey}`}
                        alt={recipe.title}
                        className="h-48 w-full rounded object-cover"
                      />
                      <p className="font-mono text-xs break-all text-green-700">
                        ✅ {recipe.imageKey}
                      </p>
                    </div>
                  ) : recipe.errorMessage ? (
                    <div className="h-64 overflow-y-auto rounded bg-red-50 p-4 text-sm text-red-600">
                      ❌ {recipe.errorMessage}
                    </div>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                      '전체 이미지 생성' 버튼을 눌러주세요.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrokBatchAnalyzer;
