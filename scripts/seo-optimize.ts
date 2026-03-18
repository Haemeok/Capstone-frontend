/**
 * SEO 최적화 스크립트 — 분석 리포트의 재료 Tier를 ingredients.ts에 반영
 *
 * 실행: npx tsx scripts/seo-optimize.ts
 * 선행: npx tsx scripts/seo-classify.ts
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const REPORT_PATH = path.join(DATA_DIR, "seo-analysis-report.json");
const INGREDIENTS_PATH = path.resolve(
  process.cwd(),
  "src/shared/config/seo/ingredients.ts"
);

type TierEntry = {
  name: string;
  id: string;
  successRate: number;
  avgResult: number;
  combinations: number;
};

type Report = {
  ingredientTiers: {
    tier1: TierEntry[];
    tier2: TierEntry[];
    tier3: TierEntry[];
  };
  tierSummary: {
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
  };
};

const main = () => {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error(
      "분석 리포트가 없습니다. 먼저 `npm run seo:classify`를 실행하세요."
    );
    process.exit(1);
  }

  const report: Report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf-8"));

  // Tier 맵 생성
  const tierMap = new Map<string, 1 | 2 | 3>();
  for (const entry of report.ingredientTiers.tier1) tierMap.set(entry.id, 1);
  for (const entry of report.ingredientTiers.tier2) tierMap.set(entry.id, 2);
  for (const entry of report.ingredientTiers.tier3) tierMap.set(entry.id, 3);

  // ingredients.ts 읽기
  let content = fs.readFileSync(INGREDIENTS_PATH, "utf-8");

  // SeoIngredient 타입에 tier 추가 (이미 있으면 건너뜀)
  if (!content.includes("tier?:")) {
    content = content.replace(
      "  isMainIngredient: boolean;\n};",
      "  isMainIngredient: boolean;\n  tier?: 1 | 2 | 3;\n};"
    );
  }

  // 각 재료에 tier 추가/갱신
  const lineRegex =
    /\{ id: "([^"]+)", name: "([^"]+)", isMainIngredient: (true|false)(?:, tier: [123])? \}/g;

  content = content.replace(lineRegex, (match, id, name, isMain) => {
    const tier = tierMap.get(id);
    if (tier && isMain === "true") {
      return `{ id: "${id}", name: "${name}", isMainIngredient: true, tier: ${tier} }`;
    }
    return `{ id: "${id}", name: "${name}", isMainIngredient: ${isMain} }`;
  });

  // 주석 업데이트
  const dateStr = new Date().toISOString().split("T")[0];
  content = content.replace(
    /\/\/ Generated: .*/,
    `// Generated: ${dateStr} (Tier updated)`
  );

  fs.writeFileSync(INGREDIENTS_PATH, content, "utf-8");

  console.log("=== ingredients.ts 업데이트 완료 ===");
  console.log(`Tier 1: ${report.tierSummary.tier1Count}개`);
  console.log(`Tier 2: ${report.tierSummary.tier2Count}개`);
  console.log(`Tier 3: ${report.tierSummary.tier3Count}개`);
  console.log(
    `Tier 미분류 (양념류 등): ${tierMap.size === 0 ? "N/A" : `${679 - tierMap.size}개`}`
  );
  console.log(`\n저장: ${INGREDIENTS_PATH}`);
};

main();
