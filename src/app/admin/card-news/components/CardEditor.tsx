"use client";

import { createRef, useEffect, useRef, useState } from "react";

import { Recipe } from "@/entities/recipe/model/types";

import { askGrok } from "@/app/actions/grok";

import { saveAllCards } from "../lib/capture";
import { buildCardNewsPrompt } from "../lib/prompt";
import { RecipeCard } from "./cards/RecipeCard";
import { ThumbnailCard } from "./cards/ThumbnailCard";

type CardEditorProps = {
  query: string;
  thumbnail: Recipe;
  recipes: Recipe[];
};

type CardTexts = {
  hooking: string;
  subject: string;
  summaries: { title: string; summary: string }[];
};

const getRandomPosition = (): "top" | "bottom" => {
  return Math.random() > 0.5 ? "top" : "bottom";
};

export const CardEditor = ({ query, thumbnail, recipes }: CardEditorProps) => {
  const [texts, setTexts] = useState<CardTexts | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [boxPositions, setBoxPositions] = useState<("top" | "bottom")[]>([]);

  const thumbnailRef = useRef<HTMLDivElement>(null);
  const recipeRefs = useRef<React.RefObject<HTMLDivElement | null>[]>([]);

  // 레시피별 ref 초기화
  useEffect(() => {
    recipeRefs.current = recipes.map(() => createRef<HTMLDivElement>());
    setBoxPositions(recipes.map(() => getRandomPosition()));
  }, [recipes]);

  // AI 텍스트 생성
  const generateTexts = async () => {
    setGenerating(true);
    try {
      const prompt = buildCardNewsPrompt(query, thumbnail, recipes);
      const result = await askGrok(prompt);

      if (!result.success) {
        alert(`AI 생성 실패: ${result.error}`);
        return;
      }

      let json = result.message.trim();
      if (json.startsWith("```")) {
        json = json.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const parsed: CardTexts = JSON.parse(json);
      setTexts(parsed);
      setFolderName(parsed.subject);
    } catch (err) {
      console.error("AI 텍스트 파싱 실패:", err);
      alert("AI 응답 파싱에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setGenerating(false);
    }
  };

  // 초기 생성
  useEffect(() => {
    generateTexts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 텍스트 업데이트 헬퍼
  const updateHooking = (value: string) => {
    setTexts((prev) => (prev ? { ...prev, hooking: value } : null));
  };

  const updateSubject = (value: string) => {
    setTexts((prev) => (prev ? { ...prev, subject: value } : null));
    setFolderName(value);
  };

  const updateSummary = (index: number, value: string) => {
    setTexts((prev) => {
      if (!prev) return null;
      const summaries = [...prev.summaries];
      summaries[index] = { ...summaries[index], summary: value };
      return { ...prev, summaries };
    });
  };

  const toggleBoxPosition = (index: number) => {
    setBoxPositions((prev) => {
      const next = [...prev];
      next[index] = next[index] === "top" ? "bottom" : "top";
      return next;
    });
  };

  // 전체 저장
  const handleSave = async () => {
    if (!texts) return;
    setSaving(true);
    try {
      const allRefs = [thumbnailRef, ...recipeRefs.current];
      const allNames = [
        "thumbnail.png",
        ...recipes.map((r, i) => `recipe-${i + 1}-${r.title}.png`),
      ];
      await saveAllCards(allRefs, allNames, folderName);
      alert("저장 완료!");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("저장 실패:", err);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!texts && generating) {
    return (
      <div className="py-12 text-center text-gray-400">
        AI가 카드뉴스 텍스트를 생성 중입니다...
      </div>
    );
  }

  return (
    <div>
      {/* 상단 컨트롤 */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={generateTexts}
          disabled={generating}
          className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:text-gray-400"
        >
          {generating ? "생성 중..." : "🤖 AI 재생성"}
        </button>
        <div className="flex-1" />
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="폴더명"
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-olive-light focus:outline-none"
        />
        <button
          onClick={handleSave}
          disabled={saving || !texts}
          className="rounded-xl bg-olive-light px-6 py-2 text-sm font-bold text-white disabled:bg-gray-200 disabled:text-gray-400"
        >
          {saving ? "저장 중..." : "💾 전체 저장"}
        </button>
      </div>

      {texts && (
        <div className="flex gap-8">
          {/* 왼쪽: 편집 패널 */}
          <div className="w-[400px] flex-shrink-0 space-y-6">
            {/* 썸네일 텍스트 */}
            <div className="rounded-2xl border border-gray-100 p-4">
              <h3 className="mb-3 text-sm font-bold text-gray-900">썸네일</h3>
              <label className="mb-1 block text-xs text-gray-500">
                후킹 문구
              </label>
              <textarea
                value={texts.hooking}
                onChange={(e) => updateHooking(e.target.value)}
                rows={2}
                className="mb-3 w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-olive-light focus:outline-none"
              />
              <label className="mb-1 block text-xs text-gray-500">
                주제 요약
              </label>
              <textarea
                value={texts.subject}
                onChange={(e) => updateSubject(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-olive-light focus:outline-none"
              />
            </div>

            {/* 레시피 카드 텍스트 */}
            {recipes.map((recipe, i) => (
              <div
                key={recipe.id}
                className="rounded-2xl border border-gray-100 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">
                    카드 {i + 1}: {recipe.title}
                  </h3>
                  <button
                    onClick={() => toggleBoxPosition(i)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    박스 {boxPositions[i] === "top" ? "↑ 상단" : "↓ 하단"}
                  </button>
                </div>
                <label className="mb-1 block text-xs text-gray-500">
                  요약 (5줄)
                </label>
                <textarea
                  value={texts.summaries[i + 1]?.summary ?? ""}
                  onChange={(e) => updateSummary(i + 1, e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-olive-light focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="flex-1 space-y-6 overflow-auto">
            <p className="text-xs text-gray-400">
              미리보기 (축소됨, 실제 저장은 1080x1350)
            </p>

            {/* 썸네일 미리보기 */}
            <div style={{ width: 1080 * 0.35, height: 1350 * 0.35, overflow: "hidden" }}>
              <div
                className="origin-top-left"
                style={{ transform: "scale(0.35)", width: 1080, height: 1350 }}
              >
                <ThumbnailCard
                  ref={thumbnailRef}
                  imageUrl={thumbnail.imageUrl}
                  hooking={texts.hooking}
                  subject={texts.subject}
                />
              </div>
            </div>

            {/* 레시피 카드 미리보기 */}
            {recipes.map((recipe, i) => (
              <div key={recipe.id} style={{ width: 1080 * 0.35, height: 1350 * 0.35, overflow: "hidden" }}>
                <div
                  className="origin-top-left"
                  style={{ transform: "scale(0.35)", width: 1080, height: 1350 }}
                >
                  <RecipeCard
                    ref={recipeRefs.current[i]}
                    imageUrl={recipe.imageUrl}
                    title={recipe.title}
                    summary={texts.summaries[i + 1]?.summary ?? ""}
                    boxPosition={boxPositions[i] ?? "bottom"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
