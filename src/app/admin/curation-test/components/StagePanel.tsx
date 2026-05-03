"use client";

import type { GenerateCurationOutput } from "@/entities/curation";

export const StagePanel = ({ result }: { result: GenerateCurationOutput }) => (
  <section className="rounded border p-3 space-y-3">
    <p className="text-xs text-gray-500">
      <span className="font-mono inline-block px-2 py-0.5 rounded bg-gray-100">
        {result.provider}
      </span>{" "}
      · tone <code>{result.toneSeed}</code>
    </p>
    <details>
      <summary className="text-sm font-bold cursor-pointer">
        slug · recipeIds · thumbnail
      </summary>
      <pre className="text-xs mt-2">
        {JSON.stringify(
          {
            slug: result.slug,
            recipeIds: result.recipeIds,
            thumbnailUrl: result.thumbnailUrl,
          },
          null,
          2,
        )}
      </pre>
    </details>
    <details>
      <summary className="text-sm font-bold cursor-pointer">
        title (h1 + dek)
      </summary>
      <p className="text-xl font-bold mt-2">{result.h1}</p>
      <p className="text-sm text-gray-600">{result.dek}</p>
    </details>
    <details>
      <summary className="text-sm font-bold cursor-pointer">
        최종 마크다운 raw
      </summary>
      <pre className="text-xs mt-2 whitespace-pre-wrap">{result.markdown}</pre>
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
