"use client";

import React, { useState, useId } from "react";

import { RecipePayload } from "@/entities/recipe/model/types";
import { useImagePreview } from "@/shared/hooks/useImagePreview";
import { ImagePickerView } from "@/shared/ui/image/ImagePickerView";

import { useAdminRecipeUpload } from "@/features/recipe-create/model/hooks/useAdminRecipeUpload";

const AdminRecipeUploadPage = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const { uploadRecipe, isPending, error } = useAdminRecipeUpload();

  const previewUrl = useImagePreview(mainImage);
  const imageInputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mainImage) {
      alert("메인 썸네일 이미지를 선택해주세요.");
      return;
    }

    try {
      const parsedData: RecipePayload = JSON.parse(jsonInput);
      uploadRecipe({
        recipeData: parsedData,
        mainImage,
        likeCount,
        ratingCount,
      });
    } catch (err) {
      alert(
        "JSON 파싱 오류: " +
          (err instanceof Error ? err.message : "알 수 없는 오류")
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-20 flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm">
            <span className="text-sm text-emerald-700">
              [베스트 셀러] 쇼츠 게시판 &gt;
            </span>{" "}
          </p>
          <p className="text-2xl">냉부시절과 다른 마음가짐인 다크호스 정호영</p>
        </div>
        <h1 className="mb-6 text-3xl font-bold">관리자용 레시피 업로드</h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">필수 필드 및 타입</h2>
          <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
            {`{
  "title": string,
  "description": string,
  "cookingTime": number,
  "servings": number,
  "dishType": string,
  "ingredients": [
    {
      "name": string,
      "quantity": string,
      "unit": string
    }
  ],
  "steps": [
    {
      "stepNumber": number,
      "instruction": string,
      "ingredients": [
        {
          "name": string,
          "quantity": string (optional),
          "unit": string
        }
      ]
    }
  ],
  "cookingTools": string[],
  "tags": string[]
}`}
          </pre>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow"
        >
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              메인 썸네일 이미지
            </label>
            <div className="aspect-square w-1/2">
              <ImagePickerView
                className="overflow-hidden rounded-lg"
                inputId={imageInputId}
                previewUrl={previewUrl}
                inputProps={{
                  onChange: handleImageChange,
                  accept: "image/jpeg,image/png,image/gif,image/webp",
                }}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="jsonInput"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              레시피 JSON 데이터
            </label>
            <textarea
              id="jsonInput"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="h-96 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm"
              placeholder="레시피 JSON 데이터를 입력하세요..."
            />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="likeCount"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                좋아요 수 100이하
              </label>
              <input
                id="likeCount"
                type="number"
                value={likeCount}
                onChange={(e) => setLikeCount(Number(e.target.value))}
                min="0"
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>
            <div>
              <label
                htmlFor="ratingCount"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                평가 수 100이하
              </label>
              <input
                id="ratingCount"
                type="number"
                value={ratingCount}
                onChange={(e) => setRatingCount(Number(e.target.value))}
                min="0"
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>
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
            {isPending ? "업로드 중..." : "레시피 업로드"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRecipeUploadPage;
