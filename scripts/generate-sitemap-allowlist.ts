/**
 * 감사 결과에서 ACTIVE 페이지만 추출하여 사이트맵 allowlist 생성
 *
 * 실행: npx tsx scripts/generate-sitemap-allowlist.ts
 * 선행: npx tsx scripts/seo-audit.ts (감사 먼저 실행)
 */

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const AUDIT_LATEST = path.join(DATA_DIR, "seo-audit-latest.json");
const OUTPUT_PATH = path.resolve(
  process.cwd(),
  "src/shared/config/seo/sitemap-allowlist.json"
);

// IMMATURE 아카이브 출력 경로
const ARCHIVE_PATH = path.join(DATA_DIR, "seo-immature-archive.json");

const main = () => {
  if (!fs.existsSync(AUDIT_LATEST)) {
    console.error(
      "감사 결과가 없습니다. 먼저 `npx tsx scripts/seo-audit.ts`를 실행하세요."
    );
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(AUDIT_LATEST, "utf-8"));
  const pages: Array<{
    params: Record<string, string | number>;
    resultCount: number;
    status: string;
    category: string;
  }> = audit.pages;

  // ACTIVE 페이지 → allowlist
  const activePages = pages
    .filter((p) => p.status === "ACTIVE")
    .map((p) => p.params);

  const allowlist = {
    generatedAt: new Date().toISOString(),
    totalPages: activePages.length,
    pages: activePages,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allowlist, null, 2), "utf-8");
  console.log(`Allowlist 생성: ${OUTPUT_PATH}`);
  console.log(`ACTIVE 페이지: ${activePages.length}개 (전체 ${pages.length}개 중)`);

  // IMMATURE/EMPTY 아카이브
  const immatureNearActive = pages.filter(
    (p) => p.status === "IMMATURE" && p.resultCount >= 5
  );
  const immatureGrowing = pages.filter(
    (p) => p.status === "IMMATURE" && p.resultCount >= 2 && p.resultCount < 5
  );
  const immatureDormant = pages.filter(
    (p) => p.status === "IMMATURE" && p.resultCount === 1
  );
  const emptyPages = pages.filter((p) => p.status === "EMPTY");

  const archive = {
    generatedAt: new Date().toISOString(),
    summary: {
      nearActive: immatureNearActive.length,
      growing: immatureGrowing.length,
      dormant: immatureDormant.length,
      empty: emptyPages.length,
    },
    immature: {
      nearActive: immatureNearActive.map((p) => ({
        params: p.params,
        resultCount: p.resultCount,
        category: p.category,
      })),
      growing: immatureGrowing.map((p) => ({
        params: p.params,
        resultCount: p.resultCount,
        category: p.category,
      })),
      dormant: immatureDormant.map((p) => ({
        params: p.params,
        resultCount: p.resultCount,
        category: p.category,
      })),
    },
    empty: emptyPages.map((p) => ({
      params: p.params,
      category: p.category,
    })),
  };

  fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archive, null, 2), "utf-8");
  console.log(`\nIMMATURE 아카이브: ${ARCHIVE_PATH}`);
  console.log(`  NEAR_ACTIVE (5-7건): ${immatureNearActive.length}개`);
  console.log(`  GROWING (2-4건): ${immatureGrowing.length}개`);
  console.log(`  DORMANT (1건): ${immatureDormant.length}개`);
  console.log(`  EMPTY (0건): ${emptyPages.length}개`);
};

main();
