/**
 * SEO 성장 리포트 — 사이트맵 성장 추이 + 카테고리별 통계
 *
 * 실행: npx tsx scripts/seo-report.ts
 */

import * as fs from "fs";
import * as path from "path";
import {
  DATA_DIR, ALLOWLIST_PATH, ARCHIVE_PATH,
} from "./lib/seo-constants";
import {
  type ParamSet, classifyCategory, CATEGORY_LABELS, safeReadJson,
} from "./lib/seo-utils";

const main = () => {
  const allowlist = safeReadJson<{ generatedAt: string; stats?: { addedThisCycle: number; promotedFromImmature: number }; pages: ParamSet[] }>(ALLOWLIST_PATH);
  if (!allowlist) {
    console.error("allowlist가 없습니다. 먼저 seo:discover를 실행하세요.");
    process.exit(1);
  }

  const pages: ParamSet[] = allowlist.pages;

  // 카테고리별 집계
  const categories = new Map<string, number>();
  for (const page of pages) {
    const cat = classifyCategory(page);
    categories.set(cat, (categories.get(cat) || 0) + 1);
  }

  // 아카이브 통계
  let immatureCount = 0;
  let emptyCount = 0;
  const archive = safeReadJson<{ immature: unknown[]; empty: unknown[] }>(ARCHIVE_PATH);
  if (archive) {
    immatureCount = archive.immature?.length || 0;
    emptyCount = archive.empty?.length || 0;
  }

  // 히스토리 (discover-log 파일들)
  const logFiles = fs.existsSync(DATA_DIR)
    ? fs.readdirSync(DATA_DIR)
        .filter((f) => f.startsWith("discover-log-"))
        .sort()
    : [];

  console.log("╔══════════════════════════════════════════╗");
  console.log("║       SEO 사이트맵 성장 리포트            ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`\n생성일: ${allowlist.generatedAt}`);
  console.log(`\n=== 사이트맵 현황 ===`);
  console.log(`  ACTIVE (사이트맵 등록): ${pages.length}개`);
  console.log(`  IMMATURE (대기 중):     ${immatureCount}개`);
  console.log(`  EMPTY (결과 없음):      ${emptyCount}개`);
  console.log(`  합계:                   ${pages.length + immatureCount + emptyCount}개`);

  if (allowlist.stats) {
    console.log(`\n=== 최근 사이클 ===`);
    console.log(`  이번 추가: +${allowlist.stats.addedThisCycle}개`);
    console.log(`  IMMATURE 승격: ${allowlist.stats.promotedFromImmature}개`);
  }

  console.log(`\n=== 카테고리별 ACTIVE ===`);
  const sorted = [...categories.entries()].sort(([, a], [, b]) => b - a);
  for (const [cat, count] of sorted) {
    const label = CATEGORY_LABELS[cat] ?? cat;
    const bar = "█".repeat(Math.ceil(count / (pages.length / 30)));
    console.log(`  ${label.padEnd(20)} ${String(count).padStart(6)}  ${bar}`);
  }

  // 성장 히스토리
  if (logFiles.length > 0) {
    console.log(`\n=== 성장 히스토리 ===`);
    for (const file of logFiles.slice(-10)) {
      const log = safeReadJson<{ date: string; mode: string; newActive: number; prevActive: number }>(path.join(DATA_DIR, file));
      if (!log) continue;
      const growth = log.newActive - log.prevActive;
      const arrow = growth > 0 ? `+${growth}` : String(growth);
      console.log(`  ${log.date} [${log.mode}]: ${log.prevActive} → ${log.newActive} (${arrow})`);
    }
  }
};

main();
