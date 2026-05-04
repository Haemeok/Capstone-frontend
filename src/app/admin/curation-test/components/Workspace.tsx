"use client";

import { useState } from "react";

import { ApiError, getErrorData } from "@/shared/api/errors";

import {
  CurationError,
  type CurationProvider,
  type GenerateCurationOutput,
} from "@/entities/curation";

import { usePostAndPublishArticle } from "@/features/curation-write";

import { generateCuration } from "@/app/actions/curation";

import { useCurationStore } from "../lib/store";
import { MarkdownPreview } from "./MarkdownPreview";
import { StagePanel } from "./StagePanel";

type ToneOption = "auto" | "friendly" | "editorial";

export const Workspace = () => {
  const selected = useCurationStore((s) => s.selected);
  const [count, setCount] = useState(5);
  const [tone, setTone] = useState<ToneOption>("auto");
  const [provider, setProvider] = useState<CurationProvider>("grok");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateCurationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publishMutation = usePostAndPublishArticle();

  const onGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await generateCuration({
        params: selected,
        recipeCount: count,
        forceToneSeed: tone === "auto" ? undefined : tone,
        provider,
      });
      setResult(r);
    } catch (e) {
      const msg =
        e instanceof CurationError
          ? `[${e.code}] ${e.message}\n${JSON.stringify(e.meta ?? {}, null, 2)}`
          : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!selected) {
    return (
      <main className="p-6 text-gray-500">좌측에서 후보를 선택하세요.</main>
    );
  }

  return (
    <main className="overflow-y-auto p-6 space-y-4">
      <section className="rounded border p-3">
        <h2 className="text-sm font-bold mb-2">params</h2>
        <pre className="text-xs">{JSON.stringify(selected, null, 2)}</pre>
        <div className="mt-3 flex gap-3 items-center">
          <label className="text-sm">
            개수
            <input
              type="number"
              min={3}
              max={10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="ml-2 w-16 border rounded px-2 py-1"
            />
          </label>
          <label className="text-sm">
            톤시드
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneOption)}
              className="ml-2 border rounded px-2 py-1"
            >
              <option value="auto">auto</option>
              <option value="friendly">friendly</option>
              <option value="editorial">editorial</option>
            </select>
          </label>
          <label className="text-sm">
            모델
            <select
              value={provider}
              onChange={(e) =>
                setProvider(e.target.value as CurationProvider)
              }
              className="ml-2 border rounded px-2 py-1"
            >
              <option value="grok">Grok 4.1 Fast</option>
              <option value="solar">Solar Pro 3</option>
              <option value="hybrid">Hybrid (Solar 본문 + Grok 슬롯)</option>
            </select>
          </label>
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="ml-auto rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
          >
            {loading ? "생성 중..." : "생성하기"}
          </button>
        </div>
      </section>

      {error && (
        <pre className="rounded border border-red-300 bg-red-50 p-3 text-xs whitespace-pre-wrap">
          {error}
        </pre>
      )}

      {result && (
        <>
          <StagePanel result={result} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => publishMutation.mutate(result)}
              disabled={publishMutation.isPending}
              className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {publishMutation.isPending ? "발행 중..." : "백엔드에 발행"}
            </button>
            {publishMutation.isSuccess && publishMutation.data && (
              <span className="text-xs text-green-700">
                ✓ 발행됨 (articleId: {publishMutation.data.articleId})
              </span>
            )}
            {publishMutation.isError && (
              <span className="text-xs text-red-600">
                {formatPublishError(publishMutation.error)}
              </span>
            )}
            <a
              href={`/curation/${result.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-gray-600"
            >
              /curation/{result.slug} 열기 →
            </a>
          </div>
          <MarkdownPreview markdown={result.markdown} />
        </>
      )}
    </main>
  );
};

const formatPublishError = (err: unknown): string => {
  if (err instanceof ApiError) {
    const code = String(getErrorData(err)?.code ?? "");
    if (code === "1202") return "이미 같은 slug의 글이 존재합니다.";
    if (code === "1204") return "참조 레시피 중 일부가 존재하지 않습니다.";
    if (code === "605") return "관리자 권한이 필요합니다.";
    return `${err.status}: ${err.message}`;
  }
  return err instanceof Error ? err.message : String(err);
};
