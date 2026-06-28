import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import fs from "node:fs";
import path from "node:path";

import { assembleBlogBody } from "../src/app/admin/recipe-blog-test/lib/assembleBlogBody";
import {
  buildToneSystemPrompt,
  buildToneUserPrompt,
} from "../src/app/admin/recipe-blog-test/lib/blogTonePrompts";
import {
  parseBlogBody,
  type ParsedBlogBody,
} from "../src/app/admin/recipe-blog-test/lib/parseBlogBody";
import type { BlogTone } from "../src/app/admin/recipe-blog-test/lib/toneInserts";
import type { StaticRecipe } from "../src/entities/recipe/model/types";
import type { PublicCurationArticleDto } from "../src/features/curation/model/api.server";

const loadEnv = (file: string) => {
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^([A-Z_][A-Z_0-9]*)=(.*)$/);
      if (!m) return;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = v;
    });
};
loadEnv(".env.local");
loadEnv(".env");

const BASE_API = "https://api.recipio.kr/api";
const MODEL_ID = "solar-pro3";

const kstNow = () => new Date(Date.now() + 9 * 60 * 60 * 1000);
const kstStamp = () =>
  kstNow().toISOString().slice(0, 16).replace("T", "_").replace(":", "");
const kstReadable = () =>
  kstNow().toISOString().slice(0, 16).replace("T", " ") + " KST";

const RUN_STAMP = kstStamp();
const RUN_TIME = kstReadable();
const ROOT_DIR = "docs/blog-styles";
const OUT_DIR = `${ROOT_DIR}/run-${RUN_STAMP}-KST`;

const upstage = createOpenAI({
  name: "upstage",
  baseURL: "https://api.upstage.ai/v1",
  apiKey: process.env.UPSTAGE_API_KEY ?? "",
});

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return (await res.json()) as T;
};

const pickCuration = async (
  slugArg: string | undefined
): Promise<PublicCurationArticleDto> => {
  if (slugArg) {
    return await fetchJson<PublicCurationArticleDto>(
      `${BASE_API}/curation-articles/${slugArg}`
    );
  }
  const list = await fetchJson<{
    content: Array<{ slug: string; title: string }>;
  }>(`${BASE_API}/curation-articles?page=0&size=20`);
  for (const item of list.content) {
    const a = await fetchJson<PublicCurationArticleDto>(
      `${BASE_API}/curation-articles/${item.slug}`
    );
    if (a.recipeIds.length >= 3) return a;
  }
  throw new Error("recipes >= 3 인 큐레이션이 없음");
};

const loadRecipes = async (ids: string[]): Promise<StaticRecipe[]> => {
  const recipes: StaticRecipe[] = [];
  for (const id of ids.slice(0, 8)) {
    try {
      const r = await fetchJson<StaticRecipe>(`${BASE_API}/recipes/${id}`);
      recipes.push(r);
    } catch (e) {
      console.warn(`  recipe ${id} skip:`, (e as Error).message);
    }
  }
  return recipes;
};

type RunResult = {
  raw: string;
  assembled: string;
  parseOk: boolean;
  parseErrors: string[];
  attempts: number;
  ms: number;
  inTokens: number | string;
  outTokens: number | string;
};

const generateOneTone = async (
  tone: BlogTone,
  article: PublicCurationArticleDto,
  recipes: StaticRecipe[]
): Promise<RunResult> => {
  const model = upstage.chat(MODEL_ID);
  const system = buildToneSystemPrompt(tone);
  let userPrompt = buildToneUserPrompt({ article, recipes });

  const t0 = Date.now();
  let raw = "";
  let parseErrors: string[] = [];
  let parseOk = false;
  let parsed: ParsedBlogBody | null = null;
  let inTokens: number | string = "?";
  let outTokens: number | string = "?";
  let attempts = 0;

  for (attempts = 1; attempts <= 2; attempts++) {
    const { text, usage } = await generateText({
      model,
      system,
      prompt: userPrompt,
    });
    raw = text;
    const u = usage as
      | {
          inputTokens?: number;
          outputTokens?: number;
          promptTokens?: number;
          completionTokens?: number;
        }
      | undefined;
    inTokens = u?.inputTokens ?? u?.promptTokens ?? "?";
    outTokens = u?.outputTokens ?? u?.completionTokens ?? "?";

    const result = parseBlogBody(text, recipes.length);
    if (result.ok) {
      parseOk = true;
      parsed = result.parsed;
      break;
    }
    parseErrors = result.errors;
    userPrompt = `${buildToneUserPrompt({ article, recipes })}

[이전 시도 실패 — 반드시 수정]
${parseErrors.map((e) => `- ${e}`).join("\n")}
- ## 헤딩은 정확히 ${recipes.length}개. 마지막 ## 섹션 뒤에 \`---\` 한 줄 박을 것.`;
  }

  const ms = Date.now() - t0;
  const assembled =
    parseOk && parsed
      ? assembleBlogBody(parsed, recipes, tone, article.slug)
      : `<!-- parse 실패 — raw 그대로 -->\n\n${raw}`;

  return {
    raw,
    assembled,
    parseOk,
    parseErrors,
    attempts,
    ms,
    inTokens,
    outTokens,
  };
};

const main = async () => {
  if (!process.env.UPSTAGE_API_KEY) {
    console.error("UPSTAGE_API_KEY 미설정 — .env.local 확인");
    process.exit(1);
  }

  const slugArg = process.argv[2];

  console.log("[1/4] 큐레이션 선정 ...");
  const article = await pickCuration(slugArg);
  console.log(
    `       "${article.title}" (slug=${article.slug}, recipes=${article.recipeIds.length})`
  );

  console.log("[2/4] 레시피 detail fetch ...");
  const recipes = await loadRecipes(article.recipeIds);
  if (recipes.length < 3) {
    console.error(`살아있는 레시피 ${recipes.length}개 — 부족`);
    process.exit(1);
  }
  console.log(`       ${recipes.length} recipes loaded`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUT_DIR, "_input.md"),
    [
      `# 입력 데이터 — ${RUN_TIME}`,
      ``,
      `- slug: \`${article.slug}\``,
      `- title: ${article.title}`,
      `- recipes: ${recipes.length}개`,
      `- model: ${MODEL_ID}`,
      ``,
      `## Recipes 영양·원가 (인분 기준)`,
      ``,
      ...recipes.map((r) => {
        const s = Math.max(r.servings || 1, 1);
        return `- **${r.title}** (${s}인분, ${r.cookingTime ?? 0}분) — 1인분 ${Math.round((r.totalCalories || 0) / s)}kcal / ${Math.round((r.totalIngredientCost || 0) / s).toLocaleString()}원 / 단백 ${Math.round((r.nutrition?.protein || 0) / s)}g / 나트륨 ${Math.round((r.nutrition?.sodium || 0) / s)}mg`;
      }),
    ].join("\n"),
    "utf8"
  );

  const tones: Array<{ key: string; label: string; tone: BlogTone }> = [
    { key: "a-epigung", label: "에궁이궁 (sun8774)", tone: "epigung" },
    { key: "b-ellymom", label: "엘리맘 (ellymom81)", tone: "ellymom" },
    { key: "c-elarpi", label: "elarpi", tone: "elarpi" },
    { key: "d-minnie46", label: "여니쿡 (minnie46)", tone: "minnie46" },
    { key: "e-haetsal", label: "햇살 (17315)", tone: "haetsal" },
  ];

  console.log(`[3/4] Upstage ${MODEL_ID} — 3 톤 병렬 ...`);
  const results = await Promise.all(
    tones.map(async ({ key, label, tone }) => {
      try {
        const r = await generateOneTone(tone, article, recipes);
        const head = `<!-- style: ${label} | ${RUN_TIME} | slug: ${article.slug} | attempts=${r.attempts} | parseOk=${r.parseOk} | tokens in=${r.inTokens} out=${r.outTokens} | ${r.ms}ms | model=${MODEL_ID} -->\n\n`;
        fs.writeFileSync(
          path.join(OUT_DIR, `style-${key}.md`),
          head + r.assembled,
          "utf8"
        );
        fs.writeFileSync(
          path.join(OUT_DIR, `_raw-${key}.md`),
          head + r.raw,
          "utf8"
        );
        console.log(
          `  ✓ ${label} → style-${key}.md (parseOk=${r.parseOk}, ${r.ms}ms, in=${r.inTokens} out=${r.outTokens})`
        );
        if (!r.parseOk) {
          console.warn(`    ⚠ parse 실패: ${r.parseErrors.join("; ")}`);
        }
        return { key, label, ok: r.parseOk };
      } catch (e) {
        const msg = (e as Error).message;
        console.error(`  ✗ ${label} 실패:`, msg);
        fs.writeFileSync(
          path.join(OUT_DIR, `style-${key}.md`),
          `# 생성 실패\n\n${msg}`,
          "utf8"
        );
        return { key, label, ok: false };
      }
    })
  );

  console.log(`\n[4/4] 완료 — ${RUN_TIME}`);
  console.log(`  스냅샷: ${OUT_DIR}/`);
  results.forEach((r) => {
    console.log(
      `  ${r.ok ? "✓" : "✗"} ${r.label} → ${OUT_DIR}/style-${r.key}.md`
    );
  });
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
