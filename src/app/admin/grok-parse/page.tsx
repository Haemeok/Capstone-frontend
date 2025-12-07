"use client";

import React, { useState } from "react";
import { askGrok } from "@/app/actions/grok";
// 만약 별도 파일로 분리하지 않으셨다면, 이 import 대신 아래 주석 처리된 inline 함수를 사용하세요.
import { recipePrompt } from "./components/prompt";

// 레시피 상태 타입 정의
type RecipeStatus = "idle" | "loading" | "success" | "error";

interface ParsedRecipe {
  id: string;
  title: string;
  originalText: string;
  status: RecipeStatus;
  resultJson: string | null;
  errorMessage?: string;
}

const RecipeManager = () => {
  const [rawInput, setRawInput] = useState("");
  const [recipes, setRecipes] = useState<ParsedRecipe[]>([]);

  // 1. 나무위키 텍스트 파싱 로직
  const handleParse = () => {
    if (!rawInput.trim()) {
      alert("나무위키 텍스트를 입력해주세요.");
      return;
    }

    const splitRegex = /(?=^\d+\.\d+\.\s+)/gm;
    const rawChunks = rawInput.split(splitRegex);

    const parsedData: ParsedRecipe[] = rawChunks
      .map((chunk, index) => {
        const trimmed = chunk.trim();
        if (!trimmed) return null;

        const titleMatch = trimmed.match(/^\d+\.\d+\.\s+([^\n\[]+)/);
        const title = titleMatch ? titleMatch[1].trim() : `레시피 ${index + 1}`;

        return {
          id: `recipe-${Date.now()}-${index}`,
          title: title,
          originalText: trimmed,
          status: "idle",
          resultJson: null,
        } as ParsedRecipe;
      })
      .filter((item): item is ParsedRecipe => item !== null);

    if (parsedData.length === 0) {
      alert(
        "레시피를 찾을 수 없습니다. 텍스트 형식을 확인해주세요 (예: 1.1. 요리명)."
      );
      return;
    }

    setRecipes(parsedData);
  };

  // 2. 개별 레시피 Grok 분석 요청
  const handleAnalyze = async (id: string) => {
    const targetRecipe = recipes.find((r) => r.id === id);
    if (!targetRecipe) return;

    updateRecipeStatus(id, "loading");

    // 별도 파일이 없다면 아래 코드를 사용하세요:
    // const prompt = `JSON 스키마에 맞춰 요약해줘: ${targetRecipe.originalText}`;
    const prompt = recipePrompt(targetRecipe.originalText);

    const result = await askGrok(prompt);

    if (result.success) {
      let cleanJson = result.message.trim();
      if (cleanJson.startsWith("```json"))
        cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "");
      if (cleanJson.startsWith("```"))
        cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "");

      updateRecipeStatus(id, "success", cleanJson);
    } else {
      updateRecipeStatus(id, "error", undefined, result.error);
    }
  };

  const updateRecipeStatus = (
    id: string,
    status: RecipeStatus,
    resultJson?: string,
    errorMessage?: string
  ) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id
          ? { ...recipe, status, resultJson: resultJson || null, errorMessage }
          : recipe
      )
    );
  };

  const handleClear = () => {
    setRawInput("");
    setRecipes([]);
  };

  // 3. [신규 기능] 완료된 JSON 모두 복사하기
  const handleCopyAllJson = async () => {
    // 성공 상태이며 JSON 결과가 있는 항목만 필터링
    const completedRecipes = recipes.filter(
      (r) => r.status === "success" && r.resultJson
    );

    if (completedRecipes.length === 0) {
      alert("복사할 완료된 레시피 데이터가 없습니다.");
      return;
    }

    try {
      // 각 JSON 문자열을 객체로 변환하여 배열로 만듦
      const jsonArray = completedRecipes
        .map((r) => {
          try {
            return JSON.parse(r.resultJson!);
          } catch (e) {
            console.error(`JSON Parse Error (${r.title}):`, e);
            return null;
          }
        })
        .filter((item) => item !== null);

      // 배열을 다시 예쁘게 문자열로 변환 (indent 2)
      const finalString = JSON.stringify(jsonArray, null, 2);

      await navigator.clipboard.writeText(finalString);
      alert(
        `총 ${jsonArray.length}개의 레시피 JSON을 클립보드에 복사했습니다!`
      );
    } catch (err) {
      console.error("Clipboard Error:", err);
      alert("복사에 실패했습니다.");
    }
  };

  // UI 헬퍼: 완료된 개수 계산
  const completedCount = recipes.filter((r) => r.status === "success").length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          🥗 나무위키 레시피 파서 (Grok AI)
        </h1>

        {/* 입력 섹션 */}
        <section className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            나무위키 텍스트 전체 붙여넣기
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="mb-4 h-48 w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            placeholder="1.1. 완소짬뽕 ... 텍스트를 통째로 붙여넣으세요."
          />
          <div className="flex gap-3">
            <button
              onClick={handleParse}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              레시피 추출하기
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              초기화
            </button>
          </div>
        </section>

        {/* 결과 리스트가 있을 때만 표시되는 툴바 */}
        {recipes.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-6 py-4">
            <div className="font-medium text-indigo-900">
              총 <span className="font-bold">{recipes.length}</span>개 중{" "}
              <span className="font-bold text-green-600">{completedCount}</span>
              개 분석 완료
            </div>

            <button
              onClick={handleCopyAllJson}
              disabled={completedCount === 0}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <span>📋 완료된 JSON 전체 복사</span>
            </button>
          </div>
        )}

        {/* 결과 리스트 섹션 */}
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
                <div className="flex items-center gap-3">
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
                    {recipe.status === "loading" && "분석중..."}
                    {recipe.status === "success" && "완료"}
                    {recipe.status === "error" && "오류"}
                  </span>
                  <button
                    onClick={() => handleAnalyze(recipe.id)}
                    disabled={recipe.status === "loading"}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Grok에게 보내기 🚀
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="border-r border-gray-100 p-6">
                  <h4 className="mb-2 text-xs font-bold text-gray-400 uppercase">
                    Original Text
                  </h4>
                  <div className="h-64 overflow-y-auto rounded bg-gray-50 p-3 text-xs leading-relaxed whitespace-pre-wrap text-gray-600">
                    {recipe.originalText}
                  </div>
                </div>

                <div className="bg-slate-50 p-6">
                  <h4 className="mb-2 text-xs font-bold text-gray-400 uppercase">
                    Grok Parsed JSON
                  </h4>
                  {recipe.status === "loading" ? (
                    <div className="flex h-64 animate-pulse items-center justify-center text-sm text-gray-500">
                      Grok이 레시피를 읽고 있습니다...
                    </div>
                  ) : recipe.resultJson ? (
                    <pre className="h-64 overflow-y-auto rounded border border-gray-200 bg-white p-3 font-mono text-xs whitespace-pre-wrap text-blue-700">
                      {recipe.resultJson}
                    </pre>
                  ) : recipe.errorMessage ? (
                    <div className="h-64 rounded bg-red-50 p-4 text-sm text-red-600">
                      {recipe.errorMessage}
                    </div>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                      'Grok에게 보내기' 버튼을 눌러주세요.
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

export default RecipeManager;
