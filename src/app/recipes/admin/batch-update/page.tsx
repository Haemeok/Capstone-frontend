"use client";

import React, { useState } from "react";

import { useBatchUpdateReactions } from "@/features/recipe-batch-update/model/useBatchUpdateReactions";

const BatchUpdatePage = () => {
  const [input, setInput] = useState("");
  const {
    executeBatchUpdate,
    isPending,
    results,
    successCount,
    failCount,
    total,
  } = useBatchUpdateReactions();

  const handleUpdate = () => {
    const ids = input
      .split(/[\n,]+/) // Split by newline or comma
      .map((s) => s.trim()) // Remove whitespace
      .filter((s) => s !== ""); // Remove empty strings

    if (ids.length === 0) {
      alert("유효한 Recipe ID를 입력해주세요.");
      return;
    }

    executeBatchUpdate(ids);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">
          레시피 좋아요/평점 일괄 업데이트
        </h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="mb-4">
            <label
              htmlFor="ids-input"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Recipe IDs (콤마 또는 줄바꿈으로 구분)
            </label>
            <textarea
              id="ids-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-48 w-full rounded-lg border border-gray-300 p-4 font-mono text-sm"
              placeholder="101&#13;&#10;102&#13;&#10;103, 104"
              disabled={isPending}
            />
            <p className="mt-2 text-sm text-gray-500">
              * 각 ID에 대해 5~35 사이의 랜덤한 좋아요/평점이 부여됩니다.
              <br />* 좋아요 수는 항상 평점 수보다 많게 설정됩니다.
            </p>
          </div>

          <button
            onClick={handleUpdate}
            disabled={isPending || !input.trim()}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isPending ? "업데이트 진행 중..." : "일괄 업데이트 시작"}
          </button>
        </div>

        {/* Results Area */}
        {(results.length > 0 || isPending) && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              진행 상황 / 결과
              {total > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  (성공: {successCount}, 실패: {failCount}, 전체: {total})
                </span>
              )}
            </h2>

            <div className="max-h-96 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pl-2">ID</th>
                    <th className="py-2">상태</th>
                    <th className="py-2">설정값</th>
                    <th className="py-2">메시지</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.recipeId}
                      className={`border-b border-gray-100 ${
                        result.status === "rejected" ? "bg-red-50" : ""
                      }`}
                    >
                      <td className="py-2 pl-2 font-mono">{result.recipeId}</td>
                      <td className="py-2">
                        {result.status === "fulfilled" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            성공
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            실패
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        {result.status === "fulfilled" ? (
                          <span className="text-gray-600">
                            👍 {result.likeCount} / ⭐ {result.ratingCount}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 text-gray-500">
                        {result.status === "fulfilled"
                          ? "업데이트 완료"
                          : result.reason instanceof Error
                            ? result.reason.message
                            : String(result.reason)}
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && isPending && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-500"
                      >
                        처리 중...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchUpdatePage;
