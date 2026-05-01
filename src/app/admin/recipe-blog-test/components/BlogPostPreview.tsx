"use client";

import { useMemo, useState } from "react";

import type { IngredientItem } from "@/entities/ingredient";
import type { Recipe } from "@/entities/recipe/model/types";

import type { BlogPost } from "../lib/blogPost.schema";
import type { SequenceModelId } from "../lib/types";
import type { SequenceResults } from "../lib/useSequenceGenerate";

type Props = {
  post: BlogPost;
  recipe: Recipe;
  results: SequenceResults;
  primaryModelId: SequenceModelId;
  usedSeeds?: { lead: string; closing: string };
};

const TARGET_MIN = 1500;
const TARGET_MAX = 2000;

const countNarrativeChars = (post: BlogPost): number => {
  const stepsBody = post.steps.map((s) => s.body).join("");
  const tips = post.kitchenTips.join("");
  return (
    post.lead.length +
    stepsBody.length +
    tips.length +
    post.appliedKnowledge.length +
    (post.bonusVariation?.length ?? 0) +
    post.closingNote.length
  );
};

const findImageUrl = (
  results: SequenceResults,
  primaryModelId: SequenceModelId,
  imageSlot: string
): string | null => {
  const cell = results[imageSlot]?.[primaryModelId];
  if (cell?.status === "success") return cell.imageUrl;
  return null;
};

type DisplayIngredient = Omit<IngredientItem, "inFridge"> | IngredientItem;

const formatIngredient = (i: DisplayIngredient): string => {
  const qtyUnit = `${i.quantity ?? ""}${i.unit ?? ""}`.trim();
  return qtyUnit ? `${i.name} ${qtyUnit}` : i.name;
};

export const BlogPostPreview = ({
  post,
  recipe,
  results,
  primaryModelId,
  usedSeeds,
}: Props) => {
  const [showJson, setShowJson] = useState(false);
  const charCount = useMemo(() => countNarrativeChars(post), [post]);
  const inRange = charCount >= TARGET_MIN && charCount <= TARGET_MAX;

  const finalImageUrl = findImageUrl(results, primaryModelId, "final-plated");
  const ingredients = recipe.ingredients ?? [];

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <p>
          이 글은 자동 생성되었습니다. 매거진 시그너처(계절·산지·전통·실패 지점)의 사실 여부는 발행 전 검수가 필요합니다.
        </p>
        {usedSeeds && (
          <p className="shrink-0 text-gray-400">
            seed: {usedSeeds.lead} / {usedSeeds.closing}
          </p>
        )}
      </div>

      <header className="mb-8">
        <h1 className="text-2xl font-bold leading-snug text-gray-900">
          {post.title.main}
        </h1>
        <p className="mt-2 text-base text-gray-500">{post.title.sub}</p>
      </header>

      {finalImageUrl && (
        <figure className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={finalImageUrl}
            alt={post.alts["final-plated"] ?? post.title.main}
            className="w-full rounded-xl object-cover"
          />
          <figcaption className="mt-2 text-center text-xs text-gray-400">
            {post.captionForPlated}
          </figcaption>
        </figure>
      )}

      <p className="mb-10 whitespace-pre-line text-base leading-loose text-gray-700">
        {post.lead}
      </p>

      <section className="mb-10 rounded-xl border-y border-gray-200 px-1 py-6">
        <p className="mb-4 text-sm text-gray-500">
          {recipe.servings ? `${recipe.servings}인분 기준` : "재료"}
        </p>
        {ingredients.length === 0 ? (
          <p className="text-sm text-gray-400">재료 정보 없음</p>
        ) : (
          <ul className="grid gap-x-6 gap-y-1 text-sm text-gray-800 sm:grid-cols-2">
            {ingredients.map((ing) => (
              <li key={ing.id}>{formatIngredient(ing)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-10 space-y-8">
        {post.steps.map((step) => {
          const url = findImageUrl(results, primaryModelId, step.imageSlot);
          return (
            <div key={step.stepNumber}>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {step.stepNumber})
                </span>
              </div>
              <p className="whitespace-pre-line text-base leading-loose text-gray-700">
                {step.body}
              </p>
              {url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={post.alts[step.imageSlot] ?? `step ${step.stepNumber}`}
                  className="mt-4 w-full rounded-xl object-cover"
                />
              )}
            </div>
          );
        })}
      </section>

      {post.kitchenTips.length > 0 && (
        <section className="mb-10 rounded-xl bg-beige-light/40 px-5 py-5">
          <p className="mb-3 text-sm font-semibold text-gray-900">
            이런 부분 챙기시면 좋아요
          </p>
          <ol className="space-y-3 text-sm leading-relaxed text-gray-700">
            {post.kitchenTips.map((tip, i) => (
              <li key={i}>
                <span className="mr-1 font-semibold text-gray-500">{i + 1})</span>
                {tip}
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="mb-10 whitespace-pre-line text-base leading-loose text-gray-700">
        {post.appliedKnowledge}
      </p>

      {post.bonusVariation && (
        <section className="mb-10">
          <p className="mb-2 text-sm font-semibold text-gray-900">응용해 보기</p>
          <p className="whitespace-pre-line text-base leading-loose text-gray-700">
            {post.bonusVariation}
          </p>
        </section>
      )}

      <p className="mb-10 whitespace-pre-line text-base font-medium leading-loose text-gray-900">
        {post.closingNote}
      </p>

      <section className="mb-8 grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl bg-gray-50 px-4 py-4 text-sm sm:grid-cols-4">
        <Metric label="1인분 칼로리" value={`${post.nutritionBox.kcalPerServing} kcal`} />
        <Metric label="단백질" value={`${post.nutritionBox.proteinG} g`} />
        <Metric label="탄수화물" value={`${post.nutritionBox.carbohydrateG} g`} />
        <Metric label="지방" value={`${post.nutritionBox.fatG} g`} />
        <Metric label="당" value={`${post.nutritionBox.sugarG} g`} />
        <Metric label="나트륨" value={`${post.nutritionBox.sodiumMg} mg`} />
        <Metric label="1인분 원가" value={`${post.nutritionBox.costPerServingKrw.toLocaleString()} 원`} />
        <Metric label="시중가" value={`${post.nutritionBox.marketPriceKrw.toLocaleString()} 원`} />
      </section>

      <p className="mb-8 text-sm text-gray-400">{post.hashtags.join(" ")}</p>

      <footer className="border-t border-gray-100 pt-4 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>
            서술 본문 {charCount.toLocaleString()}자
            {!inRange && (
              <span className="ml-2 text-amber-500">
                (목표 {TARGET_MIN.toLocaleString()}~{TARGET_MAX.toLocaleString()}자 벗어남)
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => setShowJson((v) => !v)}
            className="text-gray-500 hover:text-gray-800"
          >
            {showJson ? "원본 JSON 닫기" : "원본 JSON 보기"}
          </button>
        </div>
        {showJson && (
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-[11px] text-gray-600">
            {JSON.stringify(post, null, 2)}
          </pre>
        )}
      </footer>
    </article>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] tracking-wide text-gray-400">{label}</p>
    <p className="mt-0.5 font-medium text-gray-800">{value}</p>
  </div>
);
