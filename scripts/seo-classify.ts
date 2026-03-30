/**
 * SEO 분류 스크립트 — 감사 결과를 분석하여 재료 Tier 분류 + 분석 리포트 생성
 *
 * 실행: npx tsx scripts/seo-classify.ts
 * 선행: npx tsx scripts/seo-audit.ts
 */

import * as fs from "fs";
import * as path from "path";
import { loadIngredientMap } from "./lib/load-ingredients";

const DATA_DIR = path.resolve(process.cwd(), "data");
const AUDIT_PATH = path.join(DATA_DIR, "seo-audit-latest.json");
const REPORT_PATH = path.join(DATA_DIR, "seo-analysis-report.json");

// ── 타입 ──

type AuditedPage = {
  params: Record<string, string | number>;
  category: string;
  resultCount: number;
  status: string;
  checkedAt: string;
};

type AuditResult = {
  generatedAt: string;
  summary: {
    totalChecked: number;
    active: number;
    immature: number;
    empty: number;
    error: number;
  };
  byCategory: Record<string, { total: number; active: number; failRate: number; avgResultCount: number }>;
  pages: AuditedPage[];
};

type IngredientReport = {
  id: string;
  name: string;
  totalCombinations: number;
  activeCombinations: number;
  avgResultCount: number;
  successRate: number;
  tier: 1 | 2 | 3;
};

// ── Tier 분류 ──

const classifyTier = (successRate: number, avgResultCount: number): 1 | 2 | 3 => {
  if (successRate >= 0.7 && avgResultCount >= 30) return 1;
  if (successRate >= 0.4 && avgResultCount >= 10) return 2;
  return 3;
};

// ── 메인 ──

const main = () => {
  if (!fs.existsSync(AUDIT_PATH)) {
    console.error("감사 결과가 없습니다. 먼저 `npm run seo:audit`를 실행하세요.");
    process.exit(1);
  }

  const audit: AuditResult = JSON.parse(fs.readFileSync(AUDIT_PATH, "utf-8"));
  const ingredientNames = loadIngredientMap();

  // ── 1. 재료별 성적표 ──
  const ingredientStats = new Map<string, { total: number; active: number; results: number[] }>();

  for (const page of audit.pages) {
    const ingId = page.params.ingredientIds as string | undefined;
    if (!ingId || typeof ingId !== "string") continue;

    // 단일 재료만 (쌍 조합은 제외)
    if (ingId.includes(",")) continue;

    if (!ingredientStats.has(ingId)) {
      ingredientStats.set(ingId, { total: 0, active: 0, results: [] });
    }

    const stats = ingredientStats.get(ingId)!;
    stats.total++;
    if (page.status === "ACTIVE") stats.active++;
    if (page.resultCount >= 0) stats.results.push(page.resultCount);
  }

  // Tier 분류
  const ingredientReports: IngredientReport[] = [];
  for (const [id, stats] of ingredientStats) {
    const name = ingredientNames.get(id) || id;
    const avgResult = stats.results.length > 0
      ? stats.results.reduce((a, b) => a + b, 0) / stats.results.length
      : 0;
    const successRate = stats.total > 0 ? stats.active / stats.total : 0;
    const tier = classifyTier(successRate, avgResult);

    ingredientReports.push({
      id,
      name,
      totalCombinations: stats.total,
      activeCombinations: stats.active,
      avgResultCount: Math.round(avgResult * 10) / 10,
      successRate: Math.round(successRate * 1000) / 1000,
      tier,
    });
  }

  // Tier별 그룹핑
  const tier1 = ingredientReports.filter((r) => r.tier === 1).sort((a, b) => b.successRate - a.successRate);
  const tier2 = ingredientReports.filter((r) => r.tier === 2).sort((a, b) => b.successRate - a.successRate);
  const tier3 = ingredientReports.filter((r) => r.tier === 3).sort((a, b) => b.avgResultCount - a.avgResultCount);

  // ── 2. 카테고리별 권장사항 ──
  const recommendations: string[] = [];

  for (const [cat, stats] of Object.entries(audit.byCategory)) {
    if (stats.failRate > 0.5) {
      recommendations.push(
        `${cat}: 실패율 ${(stats.failRate * 100).toFixed(0)}% (${stats.total - stats.active}/${stats.total}개 실패) → 조합 축소 또는 Tier 기반 필터링 필요`
      );
    }
  }

  recommendations.push(`Tier 1 재료 ${tier1.length}개 → 모든 조합 유형 유지`);
  recommendations.push(`Tier 2 재료 ${tier2.length}개 → 2D 조합까지만 유지 권장`);
  recommendations.push(`Tier 3 재료 ${tier3.length}개 → 단독 페이지만 유지 또는 제거 검토`);

  // NEAR_ACTIVE 통계
  const nearActive = audit.pages.filter((p) => p.resultCount >= 5 && p.resultCount < 8);
  recommendations.push(`NEAR_ACTIVE (5-7건) ${nearActive.length}개 → 레시피 추가 시 ACTIVE 승격 가능`);

  // ── 3. 텍스트 키워드 분석 ──
  const textKeywordsFailed = audit.pages
    .filter((p) => p.category === "A_TEXT_KEYWORD" && p.status !== "ACTIVE")
    .map((p) => ({
      keyword: p.params.q as string,
      resultCount: p.resultCount,
    }))
    .sort((a, b) => b.resultCount - a.resultCount);

  const textKeywordsTop = audit.pages
    .filter((p) => p.category === "A_TEXT_KEYWORD" && p.status === "ACTIVE")
    .sort((a, b) => b.resultCount - a.resultCount)
    .slice(0, 20)
    .map((p) => ({ keyword: p.params.q as string, resultCount: p.resultCount }));

  // ── 4. 리포트 저장 ──
  const report = {
    generatedAt: new Date().toISOString(),
    auditDate: audit.generatedAt,
    summary: audit.summary,
    ingredientTiers: {
      tier1: tier1.map((r) => ({ name: r.name, id: r.id, successRate: r.successRate, avgResult: r.avgResultCount, combinations: r.totalCombinations })),
      tier2: tier2.map((r) => ({ name: r.name, id: r.id, successRate: r.successRate, avgResult: r.avgResultCount, combinations: r.totalCombinations })),
      tier3: tier3.map((r) => ({ name: r.name, id: r.id, successRate: r.successRate, avgResult: r.avgResultCount, combinations: r.totalCombinations })),
    },
    tierSummary: {
      tier1Count: tier1.length,
      tier2Count: tier2.length,
      tier3Count: tier3.length,
    },
    categoryStats: audit.byCategory,
    textKeywords: {
      totalFailed: textKeywordsFailed.length,
      topFailed: textKeywordsFailed.slice(0, 30),
      topPerforming: textKeywordsTop,
    },
    recommendations,
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");

  // ── 콘솔 출력 ──
  console.log("=== SEO 분석 리포트 ===\n");

  console.log(`총 페이지: ${audit.summary.totalChecked}`);
  console.log(`ACTIVE: ${audit.summary.active} (${((audit.summary.active / audit.summary.totalChecked) * 100).toFixed(1)}%)`);
  console.log(`IMMATURE + EMPTY: ${audit.summary.immature + audit.summary.empty} (${(((audit.summary.immature + audit.summary.empty) / audit.summary.totalChecked) * 100).toFixed(1)}%)`);

  console.log("\n=== 재료 Tier 분류 ===");
  console.log(`Tier 1 (Strong): ${tier1.length}개 — 모든 조합 OK`);
  tier1.slice(0, 10).forEach((r) =>
    console.log(`  ${r.name}: 성공률 ${(r.successRate * 100).toFixed(0)}%, 평균 ${r.avgResultCount}건`)
  );
  if (tier1.length > 10) console.log(`  ... 외 ${tier1.length - 10}개`);

  console.log(`\nTier 2 (Medium): ${tier2.length}개 — 2D 조합까지`);
  tier2.slice(0, 10).forEach((r) =>
    console.log(`  ${r.name}: 성공률 ${(r.successRate * 100).toFixed(0)}%, 평균 ${r.avgResultCount}건`)
  );
  if (tier2.length > 10) console.log(`  ... 외 ${tier2.length - 10}개`);

  console.log(`\nTier 3 (Weak): ${tier3.length}개 — 단독만 or 제거`);
  tier3.slice(0, 10).forEach((r) =>
    console.log(`  ${r.name}: 성공률 ${(r.successRate * 100).toFixed(0)}%, 평균 ${r.avgResultCount}건`)
  );
  if (tier3.length > 10) console.log(`  ... 외 ${tier3.length - 10}개`);

  console.log("\n=== 실패 텍스트 키워드 (상위 10) ===");
  textKeywordsFailed.slice(0, 10).forEach((k) =>
    console.log(`  "${k.keyword}": ${k.resultCount}건`)
  );

  console.log("\n=== 권장사항 ===");
  recommendations.forEach((r) => console.log(`  • ${r}`));

  console.log(`\n리포트 저장: ${REPORT_PATH}`);
};

main();
