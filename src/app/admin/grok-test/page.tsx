"use client";

import React, { useState } from "react";
import { askGrok } from "@/app/actions/grok";

const GrokTestPage = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("프롬프트를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse("");

    const result = await askGrok(prompt);

    if (result.success) {
      setResponse(result.message);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  const handleClear = () => {
    setPrompt("");
    setResponse("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">
          Grok AI 테스트 (Vercel AI Gateway)
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-lg bg-white p-6 shadow"
        >
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
              className="focus:border-olive-mint focus:ring-olive-mint h-64 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm focus:ring-2 focus:outline-none"
              placeholder="Grok에게 물어볼 내용을 입력하세요..."
            />
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">오류: {error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-olive-mint hover:bg-olive-700 flex-1 cursor-pointer rounded-lg px-6 py-3 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isLoading ? "Grok에게 물어보는 중..." : "전송하기"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              초기화
            </button>
          </div>
        </form>

        {response && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Grok 응답</h2>
            <div className="max-h-[600px] overflow-auto">
              <pre className="rounded bg-gray-100 p-4 text-sm whitespace-pre-wrap">
                {response}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrokTestPage;
