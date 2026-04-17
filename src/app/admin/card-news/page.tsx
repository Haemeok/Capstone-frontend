// src/app/admin/card-news/page.tsx
"use client";

import { useState } from "react";

import { Recipe } from "@/entities/recipe/model/types";
import { useUserStore } from "@/entities/user/model/store";

import { AdminSearchFilters } from "./components/AdminSearchFilters";
import { CardEditor } from "./components/CardEditor";
import { RecipeSelector } from "./components/RecipeSelector";

type Step = "filter" | "recipe" | "editor";

type SelectedRecipes = {
  thumbnail: Recipe;
  cards: Recipe[];
};

const STEP_LABELS: Record<Step, string> = {
  filter: "1. 필터 조합 선택",
  recipe: "2. 레시피 선택",
  editor: "3. 카드 편집 & 저장",
};

const ADMIN_USER_ID = "X1BoaJNZ";

const CardNewsPage = () => {
  const user = useUserStore((state) => state.user);
  const isAuthReady = useUserStore((state) => state.isAuthReady);
  const [step, setStep] = useState<Step>("filter");
  const [selectedFilter, setSelectedFilter] = useState<Record<string, unknown>>({});
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipes | null>(null);

  const handleSearch = (params: Record<string, unknown>) => {
    setSelectedFilter(params);
    setStep("recipe");
  };

  const handleRecipesSelected = (thumbnail: Recipe, cards: Recipe[]) => {
    setSelectedRecipes({ thumbnail, cards });
    setStep("editor");
  };

  const handleBack = () => {
    if (step === "recipe") {
      setStep("filter");
      setSelectedFilter({});
    } else if (step === "editor") {
      setStep("recipe");
      setSelectedRecipes(null);
    }
  };

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
    <div className="mx-auto min-h-screen max-w-6xl bg-white p-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">카드뉴스 생성기</h1>

      {/* 스텝 인디케이터 */}
      <div className="mb-6 flex gap-4">
        {(Object.entries(STEP_LABELS) as [Step, string][]).map(([key, label]) => (
          <div
            key={key}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              step === key
                ? "bg-olive-light text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {step !== "filter" && (
        <button
          onClick={handleBack}
          className="mb-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 이전 단계
        </button>
      )}

      {step === "filter" && <AdminSearchFilters onSearch={handleSearch} />}
      {step === "recipe" && (
        <RecipeSelector filter={selectedFilter} onComplete={handleRecipesSelected} />
      )}
      {step === "editor" && selectedRecipes && (
        <CardEditor
          filter={selectedFilter}
          thumbnail={selectedRecipes.thumbnail}
          recipes={selectedRecipes.cards}
        />
      )}
    </div>
  );
};

export default CardNewsPage;
