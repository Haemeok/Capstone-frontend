// src/app/admin/card-news/page.tsx
"use client";

import { useState } from "react";

import { Recipe } from "@/entities/recipe/model/types";

import { CardEditor } from "./components/CardEditor";
import { FilterBrowser } from "./components/FilterBrowser";
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

const CardNewsPage = () => {
  const [step, setStep] = useState<Step>("filter");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipes | null>(null);

  const handleFilterSelect = (query: string) => {
    setSelectedQuery(query);
    setStep("recipe");
  };

  const handleRecipesSelected = (thumbnail: Recipe, cards: Recipe[]) => {
    setSelectedRecipes({ thumbnail, cards });
    setStep("editor");
  };

  const handleBack = () => {
    if (step === "recipe") {
      setStep("filter");
      setSelectedQuery("");
    } else if (step === "editor") {
      setStep("recipe");
      setSelectedRecipes(null);
    }
  };

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

      {step === "filter" && <FilterBrowser onSelect={handleFilterSelect} />}
      {step === "recipe" && (
        <RecipeSelector query={selectedQuery} onComplete={handleRecipesSelected} />
      )}
      {step === "editor" && selectedRecipes && (
        <CardEditor
          query={selectedQuery}
          thumbnail={selectedRecipes.thumbnail}
          recipes={selectedRecipes.cards}
        />
      )}
    </div>
  );
};

export default CardNewsPage;
