/**
 * SEO 사이트맵 성장 엔진 — ACTIVE 조합을 자동 탐색하여 allowlist에 추가
 *
 * 실행:
 *   npx tsx scripts/seo-discover.ts --full     # 초기 전수 탐색 (~1시간)
 *   npx tsx scripts/seo-discover.ts            # 매주: ACTIVE 확장 + IMMATURE 재검사
 */

import * as fs from "fs";
import * as path from "path";
import { MAIN_INGREDIENTS } from "../src/shared/config/seo/ingredients";
import {
  CONCURRENCY, DELAY_MS, MAX_ERROR_RATE, MIN_RESULTS,
  DATA_DIR, ALLOWLIST_PATH, ARCHIVE_PATH, SEEN_PATH, today,
} from "./lib/seo-constants";
import {
  type ParamSet, sleep, paramsToKey, fetchResultCount, safeReadJson,
} from "./lib/seo-utils";

const LOG_PATH = path.join(DATA_DIR, `discover-log-${today()}.json`);

const isFullMode = process.argv.includes("--full");

// ── 타입 ──

type Allowlist = {
  generatedAt: string;
  stats: {
    totalActive: number;
    addedThisCycle: number;
    promotedFromImmature: number;
  };
  pages: ParamSet[];
};

type ArchiveEntry = {
  params: ParamSet;
  resultCount: number;
  lastChecked: string;
};

type Archive = {
  immature: ArchiveEntry[];
  empty: ArchiveEntry[];
};

// ── 데이터 로드 ──

const loadAllowlist = (): Allowlist => {
  const data = safeReadJson<Allowlist>(ALLOWLIST_PATH);
  return data ?? { generatedAt: "", stats: { totalActive: 0, addedThisCycle: 0, promotedFromImmature: 0 }, pages: [] };
};

const loadArchive = (): Archive => {
  const data = safeReadJson<Archive>(ARCHIVE_PATH);
  return data ?? { immature: [], empty: [] };
};

const loadSeen = (): Set<string> => {
  const data = safeReadJson<string[]>(SEEN_PATH);
  return data ? new Set(data) : new Set();
};

const saveSeen = (seen: Set<string>) => {
  fs.writeFileSync(SEEN_PATH, JSON.stringify([...seen]), "utf-8");
};

// ── 조합 생성 ──

const DISH_TYPES = ["FRYING", "SOUP_STEW", "GRILL", "SALAD", "FRIED_PAN", "STEAMED_BRAISED", "OVEN", "RAW", "PICKLE", "RICE_NOODLE", "DESSERT"];
const TAGS = ["CHEF_RECIPE", "HOME_PARTY", "BRUNCH", "QUICK", "LATE_NIGHT", "LUNCHBOX", "PICNIC", "CAMPING", "HEALTHY", "KIDS", "SOLO", "HOLIDAY", "DRINK", "AIR_FRYER", "HANGOVER"];
const COSTS = [3000, 5000, 10000, 15000];

const generateFullCombinations = (): ParamSet[] => {
  const combos: ParamSet[] = [];
  const ingredients = MAIN_INGREDIENTS;

  // 1D: 재료 단독
  for (const ing of ingredients) {
    combos.push({ ingredientIds: ing.id });
  }

  // 1D: dishType 단독
  for (const d of DISH_TYPES) {
    combos.push({ dishType: d });
  }

  // 1D: tags 단독
  for (const t of TAGS) {
    combos.push({ tags: t });
  }

  // 1D: cost 단독
  for (const c of COSTS) {
    combos.push({ maxCost: c });
  }

  // 2D: 재료 × dishType
  for (const ing of ingredients) {
    for (const d of DISH_TYPES) {
      combos.push({ ingredientIds: ing.id, dishType: d });
    }
  }

  // 2D: 재료 × tags
  for (const ing of ingredients) {
    for (const t of TAGS) {
      combos.push({ ingredientIds: ing.id, tags: t });
    }
  }

  // 2D: 재료 × cost
  for (const ing of ingredients) {
    for (const c of COSTS) {
      combos.push({ ingredientIds: ing.id, maxCost: c });
    }
  }

  // 2D: dishType × tags
  for (const d of DISH_TYPES) {
    for (const t of TAGS) {
      combos.push({ dishType: d, tags: t });
    }
  }

  // 2D: dishType × cost
  for (const d of DISH_TYPES) {
    for (const c of COSTS) {
      combos.push({ dishType: d, maxCost: c });
    }
  }

  // 2D: tags × cost
  for (const t of TAGS) {
    for (const c of COSTS) {
      combos.push({ tags: t, maxCost: c });
    }
  }

  // 3D: dishType × tags × cost
  for (const d of DISH_TYPES) {
    for (const t of TAGS) {
      for (const c of COSTS) {
        combos.push({ dishType: d, tags: t, maxCost: c });
      }
    }
  }

  // 3D: 재료 × dishType × tags (상위 100 재료만)
  for (const ing of ingredients.slice(0, 100)) {
    for (const d of DISH_TYPES) {
      for (const t of ["SOLO", "QUICK", "HEALTHY"]) {
        combos.push({ ingredientIds: ing.id, dishType: d, tags: t });
      }
    }
  }

  return combos;
};

const generateExpansions = (activePages: ParamSet[]): ParamSet[] => {
  const expansions: ParamSet[] = [];

  for (const page of activePages) {
    // dishType 추가
    if (!page.dishType && page.ingredientIds) {
      for (const d of DISH_TYPES) {
        expansions.push({ ...page, dishType: d });
      }
    }
    // tags 추가
    if (!page.tags && page.ingredientIds) {
      for (const t of TAGS) {
        expansions.push({ ...page, tags: t });
      }
    }
    // cost 추가
    if (!page.maxCost && page.ingredientIds) {
      for (const c of COSTS) {
        expansions.push({ ...page, maxCost: c });
      }
    }
  }

  return expansions;
};

// ── 배치 탐색 ──

const discoverBatch = async (
  candidates: ParamSet[],
  seen: Set<string>,
  label: string
): Promise<{ active: ParamSet[]; immature: ArchiveEntry[]; empty: ArchiveEntry[]; errors: number }> => {
  // 이미 탐색한 것 제외
  const unseen = candidates.filter((c) => !seen.has(paramsToKey(c)));
  if (unseen.length === 0) {
    console.log(`  ${label}: 새로운 조합 없음 (모두 탐색 완료)`);
    return { active: [], immature: [], empty: [], errors: 0 };
  }

  console.log(`  ${label}: ${unseen.length}개 탐색 시작`);

  const active: ParamSet[] = [];
  const immature: ArchiveEntry[] = [];
  const empty: ArchiveEntry[] = [];
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < unseen.length; i += CONCURRENCY) {
    const batch = unseen.slice(i, i + CONCURRENCY);

    const results = await Promise.all(
      batch.map(async (params) => {
        const count = await fetchResultCount(params);
        seen.add(paramsToKey(params));
        return { params, count };
      })
    );

    for (const { params, count } of results) {
      if (count < 0) {
        errors++;
      } else if (count >= MIN_RESULTS) {
        active.push(params);
      } else if (count > 0) {
        immature.push({ params, resultCount: count, lastChecked: new Date().toISOString() });
      } else {
        empty.push({ params, resultCount: 0, lastChecked: new Date().toISOString() });
      }
    }

    const checked = Math.min(i + CONCURRENCY, unseen.length);
    const pct = ((checked / unseen.length) * 100).toFixed(1);
    const elapsed = Date.now() - startTime;
    const eta = Math.round((elapsed / checked) * (unseen.length - checked) / 1000);
    process.stdout.write(
      `\r  [${checked}/${unseen.length}] ${pct}% | +ACTIVE: ${active.length} | IMMATURE: ${immature.length} | ETA: ${eta}s`
    );

    // 에러율 체크
    if (checked > 100 && errors / checked > MAX_ERROR_RATE) {
      console.error(`\n  에러율 초과 — 중단`);
      break;
    }

    if (i + CONCURRENCY < unseen.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n  완료: +${active.length} ACTIVE, ${immature.length} IMMATURE, ${empty.length} EMPTY`);
  return { active, immature, empty, errors };
};

// ── 메인 ──

const main = async () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const allowlist = loadAllowlist();
  const archive = loadArchive();
  const seen = loadSeen();

  // 기존 ACTIVE를 seen에 등록
  for (const page of allowlist.pages) {
    seen.add(paramsToKey(page));
  }

  const prevTotal = allowlist.pages.length;
  let addedThisCycle = 0;
  let promotedFromImmature = 0;
  const newImmature: ArchiveEntry[] = [];
  const newEmpty: ArchiveEntry[] = [];

  console.log(`=== SEO Discover ===`);
  console.log(`모드: ${isFullMode ? "전수 탐색" : "확장 + 재검사"}`);
  console.log(`기존 ACTIVE: ${allowlist.pages.length}개`);
  console.log(`기존 IMMATURE: ${archive.immature.length}개`);
  console.log(`탐색 완료 조합: ${seen.size}개\n`);

  // ── 1. 전수 탐색 (--full) ──
  if (isFullMode) {
    console.log("── 전수 탐색 ──");
    const fullCombos = generateFullCombinations();
    console.log(`생성된 조합: ${fullCombos.length}개`);

    const result = await discoverBatch(fullCombos, seen, "전수");
    allowlist.pages.push(...result.active);
    addedThisCycle += result.active.length;
    newImmature.push(...result.immature);
    newEmpty.push(...result.empty);
  }

  // ── 2. ACTIVE 확장 ──
  if (!isFullMode) {
    console.log("── ACTIVE 확장 ──");
    const expansions = generateExpansions(allowlist.pages);
    const result = await discoverBatch(expansions, seen, "확장");
    allowlist.pages.push(...result.active);
    addedThisCycle += result.active.length;
    newImmature.push(...result.immature);
    newEmpty.push(...result.empty);
  }

  // ── 3. IMMATURE 재검사 ──
  console.log("\n── IMMATURE 재검사 ──");
  const immatureToCheck = archive.immature.map((e) => e.params);
  if (immatureToCheck.length > 0) {
    // IMMATURE는 seen에서 제거하여 재검사 가능하게
    for (const params of immatureToCheck) {
      seen.delete(paramsToKey(params));
    }

    const result = await discoverBatch(immatureToCheck, seen, "재검사");
    allowlist.pages.push(...result.active);
    addedThisCycle += result.active.length;
    promotedFromImmature = result.active.length;
    newImmature.push(...result.immature);
    newEmpty.push(...result.empty);
  } else {
    console.log("  재검사할 IMMATURE 없음");
  }

  // ── 중복 제거 ──
  const uniquePages = new Map<string, ParamSet>();
  for (const page of allowlist.pages) {
    uniquePages.set(paramsToKey(page), page);
  }
  allowlist.pages = [...uniquePages.values()];

  // ── 저장 ──
  allowlist.generatedAt = new Date().toISOString();
  allowlist.stats = {
    totalActive: allowlist.pages.length,
    addedThisCycle,
    promotedFromImmature,
  };

  fs.writeFileSync(ALLOWLIST_PATH, JSON.stringify(allowlist, null, 2), "utf-8");

  // 아카이브 갱신 (기존 + 신규, 중복 제거)
  const immatureMap = new Map<string, ArchiveEntry>();
  const emptyMap = new Map<string, ArchiveEntry>();
  // 기존 중 ACTIVE로 승격되지 않은 것만 유지
  const activeKeys = new Set(allowlist.pages.map(paramsToKey));
  for (const e of [...archive.immature, ...newImmature]) {
    const key = paramsToKey(e.params);
    if (!activeKeys.has(key)) {
      immatureMap.set(key, e);
    }
  }
  for (const e of [...archive.empty, ...newEmpty]) {
    const key = paramsToKey(e.params);
    if (!activeKeys.has(key)) {
      emptyMap.set(key, e);
    }
  }

  const updatedArchive: Archive = {
    immature: [...immatureMap.values()],
    empty: [...emptyMap.values()],
  };
  fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(updatedArchive, null, 2), "utf-8");

  // seen 저장
  saveSeen(seen);

  // 로그 저장
  const log = {
    date: today(),
    mode: isFullMode ? "full" : "incremental",
    prevActive: prevTotal,
    newActive: allowlist.pages.length,
    addedThisCycle,
    promotedFromImmature,
    totalImmature: updatedArchive.immature.length,
    totalEmpty: updatedArchive.empty.length,
    totalSeen: seen.size,
  };
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");

  // ── 결과 출력 ──
  console.log("\n=== 결과 ===");
  console.log(`사이트맵 ACTIVE: ${prevTotal} → ${allowlist.pages.length} (+${addedThisCycle})`);
  console.log(`IMMATURE 승격: ${promotedFromImmature}건`);
  console.log(`IMMATURE 보관: ${updatedArchive.immature.length}건`);
  console.log(`EMPTY 보관: ${updatedArchive.empty.length}건`);
  console.log(`탐색 완료 조합: ${seen.size}건`);
  console.log(`\nallowlist: ${ALLOWLIST_PATH}`);
  console.log(`archive: ${ARCHIVE_PATH}`);
  console.log(`log: ${LOG_PATH}`);
};

main().catch((err) => {
  console.error("탐색 실패:", err);
  process.exit(1);
});
