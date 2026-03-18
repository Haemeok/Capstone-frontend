/**
 * SEO 키워드 교체 제안 — 실패한 텍스트 키워드의 대체 키워드를 제안
 *
 * 실행: npx tsx scripts/seo-keyword-replacer.ts
 * 선행: npx tsx scripts/seo-classify.ts
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const REPORT_PATH = path.join(DATA_DIR, "seo-analysis-report.json");
const OUTPUT_PATH = path.join(DATA_DIR, "seo-keyword-suggestions.json");

type FailedKeyword = {
  keyword: string;
  resultCount: number;
};

type Report = {
  textKeywords: {
    totalFailed: number;
    topFailed: FailedKeyword[];
    topPerforming: FailedKeyword[];
  };
};

// 성공 키워드에서 자주 등장하는 토큰 추출
const extractPopularTokens = (keywords: FailedKeyword[]): Map<string, number> => {
  const tokenCounts = new Map<string, number>();
  for (const kw of keywords) {
    const tokens = kw.keyword.split(/\s+/);
    for (const token of tokens) {
      if (token.length < 2) continue;
      tokenCounts.set(token, (tokenCounts.get(token) || 0) + kw.resultCount);
    }
  }
  return tokenCounts;
};

const main = () => {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error("분석 리포트가 없습니다. 먼저 `npm run seo:classify`를 실행하세요.");
    process.exit(1);
  }

  const report: Report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf-8"));
  const { topFailed, topPerforming } = report.textKeywords;

  // 성공 키워드의 인기 토큰
  const popularTokens = extractPopularTokens(topPerforming);
  const sortedTokens = [...popularTokens.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50);

  console.log("=== 성공 키워드 인기 토큰 (상위 20) ===");
  sortedTokens.slice(0, 20).forEach(([token, score]) =>
    console.log(`  ${token}: ${score}`)
  );

  // 실패 키워드 분석 + 제안
  const suggestions: Array<{
    original: string;
    resultCount: number;
    reason: string;
    suggestions: string[];
  }> = [];

  // NEAR_ACTIVE (5-7건) — 레시피 추가만 기다리면 됨
  const nearActive = topFailed.filter((k) => k.resultCount >= 5);
  const trulyFailed = topFailed.filter((k) => k.resultCount < 5);

  console.log(`\n=== NEAR_ACTIVE 키워드 (5-7건, ${nearActive.length}개) ===`);
  console.log("  → 레시피 추가 시 자동 ACTIVE 승격, 교체 불필요");
  nearActive.slice(0, 10).forEach((k) =>
    console.log(`  "${k.keyword}": ${k.resultCount}건`)
  );

  console.log(`\n=== 교체 대상 키워드 (0-4건, ${trulyFailed.length}개) ===`);

  // 인기 토큰 Set
  const popularTokenSet = new Set(sortedTokens.map(([t]) => t));

  for (const kw of trulyFailed.slice(0, 50)) {
    const tokens = kw.keyword.split(/\s+/);
    const suggestionList: string[] = [];
    let reason = "";

    if (kw.resultCount === 0) {
      reason = "결과 0건 — DB에 해당 레시피 없음";
    } else {
      reason = `결과 ${kw.resultCount}건 — 8건 미만`;
    }

    // 토큰 중 인기 토큰이 아닌 것을 인기 토큰으로 교체 제안
    for (let i = 0; i < tokens.length; i++) {
      if (!popularTokenSet.has(tokens[i])) {
        // 유사한 인기 토큰 찾기 (같은 카테고리)
        for (const [popToken] of sortedTokens.slice(0, 30)) {
          if (popToken === tokens[i]) continue;
          const newTokens = [...tokens];
          newTokens[i] = popToken;
          const suggestion = newTokens.join(" ");
          if (!suggestionList.includes(suggestion)) {
            suggestionList.push(suggestion);
          }
          if (suggestionList.length >= 3) break;
        }
      }
    }

    suggestions.push({
      original: kw.keyword,
      resultCount: kw.resultCount,
      reason,
      suggestions: suggestionList.slice(0, 3),
    });
  }

  suggestions.slice(0, 15).forEach((s) => {
    console.log(`\n  "${s.original}" (${s.resultCount}건) — ${s.reason}`);
    if (s.suggestions.length > 0) {
      s.suggestions.forEach((sg) => console.log(`    → "${sg}"`));
    } else {
      console.log("    → 제안 없음 (수동 검토 필요)");
    }
  });

  // 저장
  const output = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFailed: topFailed.length,
      nearActive: nearActive.length,
      trulyFailed: trulyFailed.length,
    },
    nearActive: nearActive.map((k) => ({ keyword: k.keyword, resultCount: k.resultCount })),
    suggestions,
    popularTokens: sortedTokens.slice(0, 30).map(([token, score]) => ({ token, score })),
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n\n저장: ${OUTPUT_PATH}`);
};

main();
