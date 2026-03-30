/**
 * SEO 최적화 스크립트 — 분석 리포트의 재료 Tier를 ingredients.json에 반영
 *
 * 실행: npx tsx scripts/seo-optimize.ts
 * 선행: npx tsx scripts/seo-classify.ts
 */

import * as fs from "fs";
import * as path from "path";
import { DATA_DIR, INGREDIENTS_JSON_PATH } from "./lib/seo-constants";
import { loadIngredients } from "./lib/load-ingredients";

const REPORT_PATH = path.join(DATA_DIR, "seo-analysis-report.json");

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

  // ingredients.json 읽기 + 업데이트
  const ingredients = loadIngredients();

  for (const ing of ingredients) {
    if (ing.isMainIngredient && tierMap.has(ing.id)) {
      ing.tier = tierMap.get(ing.id);
    } else {
      delete ing.tier;
    }
  }

  // 저장
  fs.writeFileSync(
    INGREDIENTS_JSON_PATH,
    JSON.stringify(ingredients, null, 2),
    "utf-8"
  );

  const totalIngredients = ingredients.length;
  console.log("=== ingredients.json 업데이트 완료 ===");
  console.log(`Tier 1: ${report.tierSummary.tier1Count}개`);
  console.log(`Tier 2: ${report.tierSummary.tier2Count}개`);
  console.log(`Tier 3: ${report.tierSummary.tier3Count}개`);
  console.log(`Tier 미분류 (양념류 등): ${totalIngredients - tierMap.size}개`);
  console.log(`\n저장: ${INGREDIENTS_JSON_PATH}`);
};

main();
