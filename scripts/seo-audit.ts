/**
 * SEO 감사 스크립트 — 모든 SEO 페이지의 실제 검색 결과 수를 수집
 *
 * 실행: npx tsx scripts/seo-audit.ts
 * IMMATURE 재검사: npx tsx scripts/seo-audit.ts --recheck-immature
 */

import * as fs from "fs";
import * as path from "path";
import { generateSeoPages, type SeoPage } from "../src/shared/config/seo/seoPages";
import {
  CONCURRENCY, DELAY_MS, MAX_ERROR_RATE, MIN_RESULTS,
  DATA_DIR, today,
} from "./lib/seo-constants";
import {
  sleep, fetchResultCount, classifyCategory,
} from "./lib/seo-utils";

// ── 타입 ──

type PageStatus = "ACTIVE" | "IMMATURE" | "EMPTY" | "ERROR";

type AuditedPage = {
  params: Record<string, string | number>;
  category: string;
  resultCount: number;
  status: PageStatus;
  checkedAt: string;
};

type CategoryStats = {
  total: number;
  active: number;
  immature: number;
  empty: number;
  error: number;
  failRate: number;
  avgResultCount: number;
  medianResultCount: number;
};

type AuditResult = {
  generatedAt: string;
  pipelineVersion: string;
  summary: {
    totalChecked: number;
    active: number;
    immature: number;
    empty: number;
    error: number;
    durationMs: number;
  };
  byCategory: Record<string, CategoryStats>;
  pages: AuditedPage[];
};

// ── 유틸 ──

const median = (nums: number[]): number => {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};

const getStatus = (count: number): PageStatus => {
  if (count < 0) return "ERROR";
  if (count >= MIN_RESULTS) return "ACTIVE";
  if (count > 0) return "IMMATURE";
  return "EMPTY";
};

// ── 메인 ──

const main = async () => {
  const isRecheckImmature = process.argv.includes("--recheck-immature");

  // data 디렉토리 생성
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let pagesToCheck: SeoPage[];

  if (isRecheckImmature) {
    // IMMATURE/EMPTY만 재검사
    const archivePath = path.join(DATA_DIR, "seo-immature-archive.json");
    if (!fs.existsSync(archivePath)) {
      console.error("아카이브 파일이 없습니다. 전체 감사를 먼저 실행하세요.");
      process.exit(1);
    }
    const archive = JSON.parse(fs.readFileSync(archivePath, "utf-8"));
    const immaturePages = [
      ...(archive.immature?.nearActive ?? []),
      ...(archive.immature?.growing ?? []),
      ...(archive.immature?.dormant ?? []),
    ];
    const emptyPages = archive.empty ?? [];
    pagesToCheck = [...immaturePages, ...emptyPages].map((p: AuditedPage) => ({
      params: p.params,
      title: "",
      description: "",
    }));
    console.log(`IMMATURE/EMPTY 재검사 모드: ${pagesToCheck.length}개 페이지`);
  } else {
    pagesToCheck = generateSeoPages();
    console.log(`전체 감사 모드: ${pagesToCheck.length}개 페이지`);
  }

  const startTime = Date.now();
  const results: AuditedPage[] = [];
  let errorCount = 0;
  let activeCount = 0;
  let immatureCount = 0;
  let emptyCount = 0;

  // 배치 처리
  for (let i = 0; i < pagesToCheck.length; i += CONCURRENCY) {
    const batch = pagesToCheck.slice(i, i + CONCURRENCY);

    const batchResults = await Promise.all(
      batch.map(async (page) => {
        try {
          const count = await fetchResultCount(page.params);
          const status = getStatus(count);
          return {
            params: page.params,
            category: classifyCategory(page.params),
            resultCount: count,
            status,
            checkedAt: new Date().toISOString(),
          } as AuditedPage;
        } catch {
          return {
            params: page.params,
            category: classifyCategory(page.params),
            resultCount: -1,
            status: "ERROR" as PageStatus,
            checkedAt: new Date().toISOString(),
          } as AuditedPage;
        }
      })
    );

    for (const r of batchResults) {
      results.push(r);
      if (r.status === "ACTIVE") activeCount++;
      else if (r.status === "IMMATURE") immatureCount++;
      else if (r.status === "EMPTY") emptyCount++;
      else if (r.status === "ERROR") errorCount++;
    }

    // 진행률 표시
    const checked = Math.min(i + CONCURRENCY, pagesToCheck.length);
    const pct = ((checked / pagesToCheck.length) * 100).toFixed(1);
    const elapsed = Date.now() - startTime;
    const eta = Math.round((elapsed / checked) * (pagesToCheck.length - checked) / 1000);
    process.stdout.write(
      `\r[${checked}/${pagesToCheck.length}] ${pct}% | ACTIVE: ${activeCount} | IMMATURE: ${immatureCount} | EMPTY: ${emptyCount} | ERROR: ${errorCount} | ETA: ${eta}s`
    );

    // 에러율 체크
    if (checked > 100 && errorCount / checked > MAX_ERROR_RATE) {
      console.error(
        `\n\n에러율 ${((errorCount / checked) * 100).toFixed(1)}% > ${MAX_ERROR_RATE * 100}% — API 서버 문제 가능성. 중단합니다.`
      );
      process.exit(1);
    }

    // 배치 간 딜레이
    if (i + CONCURRENCY < pagesToCheck.length) {
      await sleep(DELAY_MS);
    }
  }

  const durationMs = Date.now() - startTime;
  console.log(`\n\n감사 완료: ${(durationMs / 1000).toFixed(1)}초`);

  // 카테고리별 통계 계산
  const byCategory: Record<string, CategoryStats> = {};
  const categoryPages: Record<string, AuditedPage[]> = {};

  for (const page of results) {
    if (!categoryPages[page.category]) {
      categoryPages[page.category] = [];
    }
    categoryPages[page.category].push(page);
  }

  for (const [cat, pages] of Object.entries(categoryPages)) {
    const counts = pages.map((p) => p.resultCount).filter((c) => c >= 0);
    const active = pages.filter((p) => p.status === "ACTIVE").length;
    const immature = pages.filter((p) => p.status === "IMMATURE").length;
    const empty = pages.filter((p) => p.status === "EMPTY").length;
    const error = pages.filter((p) => p.status === "ERROR").length;
    const failed = immature + empty;

    byCategory[cat] = {
      total: pages.length,
      active,
      immature,
      empty,
      error,
      failRate: pages.length > 0 ? failed / pages.length : 0,
      avgResultCount:
        counts.length > 0
          ? Math.round((counts.reduce((a, b) => a + b, 0) / counts.length) * 10) / 10
          : 0,
      medianResultCount: median(counts),
    };
  }

  // 결과 저장
  const auditResult: AuditResult = {
    generatedAt: new Date().toISOString(),
    pipelineVersion: "1.0.0",
    summary: {
      totalChecked: results.length,
      active: activeCount,
      immature: immatureCount,
      empty: emptyCount,
      error: errorCount,
      durationMs,
    },
    byCategory,
    pages: results,
  };

  const outputPath = path.join(DATA_DIR, `seo-audit-${today()}.json`);
  const latestPath = path.join(DATA_DIR, "seo-audit-latest.json");

  fs.writeFileSync(outputPath, JSON.stringify(auditResult, null, 2), "utf-8");
  fs.writeFileSync(latestPath, JSON.stringify(auditResult, null, 2), "utf-8");

  console.log(`\n저장: ${outputPath}`);
  console.log(`최신: ${latestPath}`);

  // 요약 출력
  console.log("\n=== 감사 요약 ===");
  console.log(`총 검사: ${results.length}`);
  console.log(`ACTIVE (8+): ${activeCount} (${((activeCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`IMMATURE (1-7): ${immatureCount} (${((immatureCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`EMPTY (0): ${emptyCount} (${((emptyCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`ERROR: ${errorCount}`);

  console.log("\n=== 카테고리별 ===");
  for (const [cat, stats] of Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(
      `${cat}: ${stats.total}개 | ACTIVE ${stats.active} | 실패율 ${(stats.failRate * 100).toFixed(0)}% | 평균 ${stats.avgResultCount}`
    );
  }

  // 이전 감사와 diff
  const prevFiles = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.startsWith("seo-audit-") && f !== `seo-audit-${today()}.json` && f !== "seo-audit-latest.json")
    .sort()
    .reverse();

  if (prevFiles.length > 0) {
    const prevPath = path.join(DATA_DIR, prevFiles[0]);
    const prev: AuditResult = JSON.parse(fs.readFileSync(prevPath, "utf-8"));
    const prevMap = new Map(prev.pages.map((p) => [JSON.stringify(p.params), p.status]));

    let promoted = 0;
    let demoted = 0;
    let newPages = 0;

    for (const page of results) {
      const key = JSON.stringify(page.params);
      const prevStatus = prevMap.get(key);
      if (!prevStatus) {
        newPages++;
      } else if (prevStatus !== "ACTIVE" && page.status === "ACTIVE") {
        promoted++;
      } else if (prevStatus === "ACTIVE" && page.status !== "ACTIVE") {
        demoted++;
      }
    }

    console.log(`\n=== 이전 감사 대비 변화 (vs ${prevFiles[0]}) ===`);
    console.log(`승격 → ACTIVE: ${promoted}건`);
    console.log(`강등 ACTIVE →: ${demoted}건`);
    console.log(`신규: ${newPages}건`);
  }
};

main().catch((err) => {
  console.error("감사 실패:", err);
  process.exit(1);
});
