"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { Image } from "@/shared/ui/image/Image";

type ImageGenerationResponse = {
  imageKey: string;
  [key: string]: any;
};

const AdminImageTestPage = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    mutate: generateImage,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: unknown) => {
      const result = await api.post<ImageGenerationResponse>(
        "https://api.recipio.kr/api/test/ai-recipe/image",
        data,
        {
          timeout: 180000,
        }
      );
      return result;
    },
    onSuccess: (data) => {
      setImageUrl(data.imageKey);
    },
    onError: (err) => {
      console.error("Image generation failed:", err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!jsonInput.trim()) {
      alert("JSON 데이터를 입력해주세요.");
      return;
    }

    try {
      const parsedData = JSON.parse(jsonInput);
      generateImage(parsedData);
    } catch (err) {
      alert(
        "JSON 파싱 오류: " +
          (err instanceof Error ? err.message : "알 수 없는 오류")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">AI 이미지 생성 테스트</h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">JSON 형식</h2>
          <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-sm">
            {`{
  "requestData": {
    "title": string,
    "dishType": string,
    "description": string,
    "tags": string[],
    "ingredients": [
      { "name": string }
    ],
    "steps": [
      { "instruction": string }
    ]
  },
  "prompt": string
}`}
          </pre>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg bg-white p-6 shadow"
        >
          <div className="mb-6">
            <label
              htmlFor="jsonInput"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              JSON 데이터
            </label>
            <textarea
              id="jsonInput"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="h-96 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm"
              placeholder="JSON 데이터를 입력하세요..."
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
            {isPending ? "생성 중..." : "이미지 생성"}
          </button>
        </form>

        {imageUrl && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">생성된 이미지</h2>
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt="Generated recipe image"
                wrapperClassName="w-full h-full"
                fit="cover"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm break-all text-gray-600">
                <strong>URL:</strong> {imageUrl}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImageTestPage;
