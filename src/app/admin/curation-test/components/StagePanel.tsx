"use client";

import type {
  CurationWarning,
  GenerateCurationOutput,
} from "@/entities/curation";

const WarningBox = ({ warnings }: { warnings: CurationWarning[] }) => {
  if (warnings.length === 0) return null;
  return (
    <div className="space-y-1 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900">
      <p className="font-bold">⚠ 검토 필요 {warnings.length}건</p>
      <ul className="space-y-0.5">
        {warnings.map((w, i) => (
          <li key={`${w.source}-${w.keyword}-${i}`}>
            {w.source === "q" ? `q="${w.keyword}"` : w.keyword} — 섹션{" "}
            {w.missingSections.map((n) => n + 1).join(", ")}에 미등장
          </li>
        ))}
      </ul>
    </div>
  );
};

export const StagePanel = ({ result }: { result: GenerateCurationOutput }) => (
  <section className="space-y-3 rounded border p-3">
    <p className="text-xs text-gray-500">
      <span className="inline-block rounded bg-gray-100 px-2 py-0.5 font-mono">
        {result.provider}
      </span>{" "}
      · tone <code>{result.toneSeed}</code>
    </p>
    <WarningBox warnings={result.warnings ?? []} />
    <details>
      <summary className="cursor-pointer text-sm font-bold">
        slug · recipeIds · thumbnail
      </summary>
      <pre className="mt-2 text-xs">
        {JSON.stringify(
          {
            slug: result.slug,
            recipeIds: result.recipeIds,
            thumbnailUrl: result.thumbnailUrl,
          },
          null,
          2
        )}
      </pre>
    </details>
    <details>
      <summary className="cursor-pointer text-sm font-bold">
        title (h1 + dek)
      </summary>
      <p className="mt-2 text-xl font-bold">{result.h1}</p>
      <p className="text-sm text-gray-600">{result.dek}</p>
    </details>
    <details>
      <summary className="cursor-pointer text-sm font-bold">
        최종 마크다운 raw
      </summary>
      <pre className="mt-2 text-xs whitespace-pre-wrap">{result.markdown}</pre>
    </details>
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(result.markdown)}
      className="text-xs underline"
    >
      마크다운 클립보드에 복사
    </button>
  </section>
);
