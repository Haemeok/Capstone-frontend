"use client";

import { useRef, useState } from "react";

import { saveAllCards } from "@/app/admin/card-news/lib/capture";

import { GridTipCard } from "./components/GridTipCard";
import { MODEL_OPTIONS } from "./lib/schema";
import { useGridCardNews } from "./lib/useGridCardNews";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-olive-light focus:outline-none focus:ring-1 focus:ring-olive-light";

export default function CardNewsGridPage() {
  const {
    modelId,
    setModelId,
    status,
    error,
    topics,
    header,
    setHeader,
    items,
    imageUrl,
    generateTopics,
    generateItems,
    generateImage,
    updateItem,
  } = useGridCardNews();
  const [seed, setSeed] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "loading";

  const handleCapture = () => {
    if (!cardRef.current) return;
    saveAllCards([cardRef], [`${header || "grid-tip"}.png`], "card-news-grid");
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-white p-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        요리팁 9그리드 카드뉴스
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        주제와 9개 음식을 AI로 뽑고 → 점토 스타일 3×3 이미지를 생성해 → 카드뉴스 한 장으로 조합합니다.
      </p>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                콘텐츠 모델
              </span>
              <select
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-1 block text-sm font-medium text-gray-700">
                시드 키워드 <span className="text-gray-400">(선택)</span>
              </span>
              <div className="flex gap-2">
                <input
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="예: 토마토 케찹"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => generateTopics(seed)}
                  disabled={isLoading}
                  className="shrink-0 cursor-pointer rounded-2xl bg-olive-light px-4 py-2 text-sm font-bold text-white transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  주제 후보
                </button>
              </div>
            </div>
          </section>

          {topics.length > 0 && (
            <section className="rounded-2xl border border-gray-100 bg-white p-4">
              <h2 className="mb-2 text-sm font-bold text-gray-900">주제 후보</h2>
              <ul className="space-y-2">
                {topics.map((t, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => generateItems(t.title)}
                      disabled={isLoading}
                      className="w-full cursor-pointer rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-olive-light hover:bg-olive-light/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="text-sm font-bold text-gray-900">
                        {t.title}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {t.concept}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {items.length > 0 && (
            <section className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
              <h2 className="text-sm font-bold text-gray-900">항목 편집</h2>
              <label className="block">
                <span className="mb-1 block text-xs text-gray-500">헤더</span>
                <input
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  className={`${inputClass} font-bold`}
                />
              </label>
              <div className="space-y-2">
                {items.map((it, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 shrink-0 pt-2 text-xs text-gray-400">
                      {i + 1}
                    </span>
                    <input
                      value={it.dishName}
                      onChange={(e) => updateItem(i, { dishName: e.target.value })}
                      className="w-28 shrink-0 rounded-xl border border-gray-200 px-2 py-2 text-sm text-gray-900 focus:border-olive-light focus:outline-none"
                    />
                    <input
                      value={it.caption}
                      onChange={(e) => updateItem(i, { caption: e.target.value })}
                      className="flex-1 rounded-xl border border-gray-200 px-2 py-2 text-sm text-gray-900 focus:border-olive-light focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={generateImage}
                disabled={isLoading}
                className="w-full cursor-pointer rounded-2xl bg-olive-light py-2.5 text-sm font-bold text-white transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isLoading ? "생성 중…" : "이미지 생성"}
              </button>
            </section>
          )}

          {imageUrl && (
            <button
              type="button"
              onClick={handleCapture}
              className="w-full cursor-pointer rounded-2xl border border-olive-light bg-white py-2.5 text-sm font-bold text-olive-light transition-colors hover:bg-olive-light/5"
            >
              카드 캡처 / 저장
            </button>
          )}

          {error && (
            <pre className="whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </pre>
          )}
        </aside>

        <main className="overflow-auto rounded-2xl border border-gray-100 bg-beige p-6">
          {imageUrl && items.length === 9 ? (
            <div className="origin-top-left scale-50">
              <GridTipCard
                ref={cardRef}
                header={header}
                imageUrl={imageUrl}
                items={items}
              />
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center text-center text-sm text-gray-400">
              주제 후보 → 항목 → 이미지 생성을 거치면
              <br />
              여기 카드 미리보기가 표시됩니다.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
