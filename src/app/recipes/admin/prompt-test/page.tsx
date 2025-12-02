"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { DISH_TYPES_FOR_CREATE_RECIPE } from "@/shared/config/constants/recipe";

type PromptTestRequest = {
  requestData: {
    ingredients: string[];
    dishType: string;
    cookingTime: number;
    servings: number;
  };
  prompt: string;
};

const AdminPromptTestPage = () => {
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [dishType, setDishType] = useState(DISH_TYPES_FOR_CREATE_RECIPE[0]);
  const [cookingTimeInput, setCookingTimeInput] = useState("");
  const [servingsInput, setServingsInput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<unknown>(null);

  const { mutate: testPrompt, isPending, error } = useMutation({
    mutationFn: async (data: PromptTestRequest) => {
      const result = await api.post("/test/ai-recipe/prompt", data);
      return result;
    },
    onSuccess: (data) => {
      setResponse(data);
    },
    onError: (err) => {
      console.error("Prompt test failed:", err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cookingTime = Number(cookingTimeInput);
    const servings = Number(servingsInput);

    if (!ingredientsInput.trim()) {
      alert("재료를 입력해주세요.");
      return;
    }

    if (isNaN(cookingTime) || cookingTime <= 0) {
      alert("유효한 조리 시간을 입력해주세요.");
      return;
    }

    if (isNaN(servings) || servings <= 0) {
      alert("유효한 인분을 입력해주세요.");
      return;
    }

    if (!prompt.trim()) {
      alert("프롬프트를 입력해주세요.");
      return;
    }

    const ingredients = ingredientsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    testPrompt({
      requestData: {
        ingredients,
        dishType,
        cookingTime,
        servings,
      },
      prompt,
    });
  };

  const handleCookingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCookingTimeInput(value);
    }
  };

  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setServingsInput(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">AI 레시피 프롬프트 테스트</h1>

        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg bg-white p-6 shadow"
        >
          <div className="mb-6">
            <label
              htmlFor="ingredients"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              재료 (쉼표로 구분)
            </label>
            <textarea
              id="ingredients"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              className="h-24 w-full rounded-lg border border-gray-300 p-3 text-sm"
              placeholder="예: 양파, 당근, 감자, 돼지고기"
            />
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="dishType"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                요리 종류
              </label>
              <select
                id="dishType"
                value={dishType}
                onChange={(e) => setDishType(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-3 text-sm"
              >
                {DISH_TYPES_FOR_CREATE_RECIPE.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cookingTime"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                조리 시간 (분)
              </label>
              <input
                id="cookingTime"
                type="text"
                inputMode="numeric"
                value={cookingTimeInput}
                onChange={handleCookingTimeChange}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                placeholder="30"
              />
            </div>

            <div>
              <label
                htmlFor="servings"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                인분
              </label>
              <input
                id="servings"
                type="text"
                inputMode="numeric"
                value={servingsInput}
                onChange={handleServingsChange}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                placeholder="2"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="prompt"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              프롬프트
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-64 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm"
              placeholder="프롬프트를 입력하세요..."
            />
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">
                오류:{" "}
                {error instanceof Error ? error.message : "알 수 없는 오류"}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-olive-mint hover:bg-olive-700 w-full cursor-pointer rounded-lg px-6 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isPending ? "테스트 중..." : "프롬프트 테스트"}
          </button>
        </form>

        {response !== null && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">응답 결과</h2>
            <div className="max-h-[600px] overflow-auto">
              <pre className="whitespace-pre-wrap rounded bg-gray-100 p-4 text-sm">
                {JSON.stringify(response, null, 2) || ""}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromptTestPage;
