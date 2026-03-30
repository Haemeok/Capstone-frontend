# SEO 파이프라인 리팩토링 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** SEO 파이프라인의 코드 중복 제거, 위험한 regex 패턴 제거, 런타임 안전성 확보, 성능 개선

**Architecture:** 7개 독립 스크립트에 흩어진 공통 로직을 `scripts/lib/seo-utils.ts`로 추출하고, regex 기반 TS 파싱을 JSON 데이터 파일로 교체하며, sitemap 생성과 health check의 성능을 개선한다.

**Tech Stack:** TypeScript, Node.js fs, Next.js metadata API

---

## 파일 구조 변경 요약

| 작업 | 파일 |
|------|------|
| **신규** | `scripts/lib/seo-utils.ts` — 공통 유틸 (fetch, retry, sleep, paramsToKey, classifyCategory) |
| **신규** | `scripts/lib/seo-constants.ts` — 공유 상수 (API_BASE, CONCURRENCY, paths 등) |
| **신규** | `src/shared/config/seo/ingredients.json` — 재료 데이터 JSON |
| **신규** | `scripts/lib/load-ingredients.ts` — JSON에서 재료 로드하는 유틸 |
| **수정** | `scripts/seo-discover.ts` — 공통 유틸 import로 교체 |
| **수정** | `scripts/seo-discover-keywords.ts` — 공통 유틸 import로 교체 |
| **수정** | `scripts/seo-audit.ts` — 공통 유틸 import로 교체 |
| **수정** | `scripts/seo-report.ts` — 공통 classifyCategory import로 교체 |
| **수정** | `scripts/seo-trend-naver.ts` — division by zero 수정 |
| **수정** | `scripts/seo-trend-gsc.ts` — 공통 classifyCategory import로 교체 |
| **수정** | `scripts/seo-classify.ts` — JSON 재료 로드로 교체 |
| **수정** | `scripts/seo-optimize.ts` — JSON 재료 파일 직접 수정으로 교체, 하드코딩 679 제거 |
| **수정** | `src/shared/config/seo/ingredients.ts` — JSON import로 교체 |
| **수정** | `src/app/sitemap.ts` — 라우트 캐싱 |
| **수정** | `scripts/seo-health/run.ts` — 독립 체크 병렬화 |

---

## Task 1: 공통 상수 모듈 추출

**Files:**
- Create: `scripts/lib/seo-constants.ts`

- [ ] **Step 1: 파일 생성**

```typescript
// scripts/lib/seo-constants.ts
import * as path from "path";

export const API_BASE = "https://api.recipio.kr/api/recipes/search";
export const CONCURRENCY = 20;
export const DELAY_MS = 100;
export const MAX_RETRIES = 3;
export const RETRY_BACKOFF = [1000, 3000, 10000];
export const TIMEOUT_MS = 10000;
export const MIN_RESULTS = 8;
export const MAX_ERROR_RATE = 0.1;

export const DATA_DIR = path.resolve(process.cwd(), "data");
export const ALLOWLIST_PATH = path.resolve(
  process.cwd(),
  "src/shared/config/seo/sitemap-allowlist.json"
);
export const ARCHIVE_PATH = path.join(DATA_DIR, "seo-archive.json");
export const SEEN_PATH = path.join(DATA_DIR, "seo-seen.json");
export const INGREDIENTS_JSON_PATH = path.resolve(
  process.cwd(),
  "src/shared/config/seo/ingredients.json"
);

export const today = () => new Date().toISOString().split("T")[0];
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 기존과 동일한 에러 수 (새 파일이 다른 것에 영향 없음)

- [ ] **Step 3: 커밋**

```bash
git add scripts/lib/seo-constants.ts
git commit -m "refactor(seo): extract shared constants to scripts/lib/seo-constants.ts"
```

---

## Task 2: 공통 유틸 모듈 추출

**Files:**
- Create: `scripts/lib/seo-utils.ts`

- [ ] **Step 1: 파일 생성**

```typescript
// scripts/lib/seo-utils.ts
import {
  API_BASE,
  MAX_RETRIES,
  RETRY_BACKOFF,
  TIMEOUT_MS,
} from "./seo-constants";

export type ParamSet = Record<string, string | number>;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const paramsToKey = (params: ParamSet): string =>
  JSON.stringify(
    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, String(v)])
  );

/**
 * API에 파라미터를 보내서 결과 수를 가져온다.
 * ParamSet을 받으면 모든 키를 query에 추가하고,
 * string을 받으면 q 파라미터로 사용한다.
 */
export const fetchResultCount = async (
  paramsOrQuery: ParamSet | string
): Promise<number> => {
  const query = new URLSearchParams({
    page: "0",
    size: "1",
    sort: "createdAt,desc",
  });

  if (typeof paramsOrQuery === "string") {
    query.set("q", paramsOrQuery);
  } else {
    for (const [key, value] of Object.entries(paramsOrQuery)) {
      query.set(key, String(value));
    }
  }

  const url = `${API_BASE}?${query.toString()}`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status === 429 || (res.status >= 500 && attempt < MAX_RETRIES)) {
          await sleep(RETRY_BACKOFF[attempt]);
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.page?.totalElements ?? 0;
    } catch {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BACKOFF[attempt]);
        continue;
      }
      return -1;
    }
  }
  return -1;
};

/**
 * 파라미터 조합의 카테고리를 분류한다.
 * seo-audit, seo-report, seo-trend-gsc에서 공통으로 사용.
 */
export const classifyCategory = (
  params: Record<string, string | number>
): string => {
  const keys = Object.keys(params);
  const hasIng = keys.includes("ingredientIds");
  const hasDish = keys.includes("dishType");
  const hasTag = keys.includes("tags");
  const hasCost = keys.includes("maxCost");
  const hasQ = keys.includes("q");
  const hasNutrition = keys.some(
    (k) => (k.startsWith("min") || k.startsWith("max")) && k !== "maxCost"
  );

  if (hasQ) return "A_TEXT_KEYWORD";
  if (hasIng && hasDish && hasTag) return "J_TRIPLE";
  if (hasIng && hasNutrition) return "I_ING_NUTRITION";
  if (hasIng && hasDish) return "C_ING_DISH";
  if (hasIng && hasTag) return "D_ING_TAG";
  if (hasIng && hasCost) return "E_ING_COST";
  if (hasIng) return "B_ING_ONLY";
  if (hasNutrition && hasCost) return "K_NUTRITION_COST";
  if (hasDish && hasTag && hasCost) return "M_DISH_TAG_COST";
  if (hasDish && hasTag) return "F_DISH_TAG";
  if (hasDish && hasCost) return "L_DISH_COST";
  if (hasTag && hasCost) return "N_TAG_COST";
  if (hasCost) return "G_COST_COMBO";
  if (hasNutrition) return "H_NUTRITION_COMBO";
  if (hasDish) return "O_DISH_ONLY";
  if (hasTag) return "P_TAG_ONLY";
  return "Z_OTHER";
};

/**
 * 리포트용 카테고리 한글 라벨.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  A_TEXT_KEYWORD: "A. 텍스트 키워드",
  B_ING_ONLY: "B. 재료 단독",
  C_ING_DISH: "C. 재료×dishType",
  D_ING_TAG: "D. 재료×tags",
  E_ING_COST: "E. 재료×cost",
  F_DISH_TAG: "F. dish×tag",
  G_COST_COMBO: "G. cost 조합",
  H_NUTRITION_COMBO: "H. 영양소 조합",
  I_ING_NUTRITION: "I. 재료×영양소",
  J_TRIPLE: "J. 재료×dish×tag",
  K_NUTRITION_COST: "K. 영양소×cost",
  L_DISH_COST: "L. dish×cost",
  M_DISH_TAG_COST: "M. dish×tag×cost",
  N_TAG_COST: "N. tag×cost",
  O_DISH_ONLY: "O. dishType 단독",
  P_TAG_ONLY: "P. tag 단독",
  Z_OTHER: "기타",
};

/**
 * JSON 파일을 안전하게 파싱한다. 파싱 실패 시 null 반환.
 */
export const safeReadJson = <T>(filePath: string): T | null => {
  try {
    const fs = require("fs");
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`JSON 파싱 실패: ${filePath}`, err);
    return null;
  }
};
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`

- [ ] **Step 3: 커밋**

```bash
git add scripts/lib/seo-utils.ts
git commit -m "refactor(seo): extract shared utils (fetch, classify, paramsToKey)"
```

---

## Task 3: ingredients.json 생성 + 로드 유틸

**Files:**
- Create: `src/shared/config/seo/ingredients.json`
- Create: `scripts/lib/load-ingredients.ts`
- Modify: `src/shared/config/seo/ingredients.ts`

- [ ] **Step 1: 기존 ingredients.ts에서 JSON 추출 스크립트 실행**

임시로 추출 스크립트를 실행하여 JSON을 생성한다.

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('src/shared/config/seo/ingredients.ts', 'utf-8');
const regex = /\{ id: \"([^\"]+)\", name: \"([^\"]+)\", isMainIngredient: (true|false)(?:, tier: ([123]))? \}/g;
const ingredients = [];
let match;
while ((match = regex.exec(content)) !== null) {
  const entry = { id: match[1], name: match[2], isMainIngredient: match[3] === 'true' };
  if (match[4]) entry.tier = Number(match[4]);
  ingredients.push(entry);
}
fs.writeFileSync('src/shared/config/seo/ingredients.json', JSON.stringify(ingredients, null, 2));
console.log('Extracted', ingredients.length, 'ingredients');
"
```

Expected: `Extracted 767 ingredients` (또는 현재 재료 수)

- [ ] **Step 2: 로드 유틸 생성**

```typescript
// scripts/lib/load-ingredients.ts
import * as fs from "fs";
import { INGREDIENTS_JSON_PATH } from "./seo-constants";

export type IngredientEntry = {
  id: string;
  name: string;
  isMainIngredient: boolean;
  tier?: 1 | 2 | 3;
};

export const loadIngredients = (): IngredientEntry[] => {
  const raw = fs.readFileSync(INGREDIENTS_JSON_PATH, "utf-8");
  return JSON.parse(raw);
};

export const loadMainIngredients = (): IngredientEntry[] =>
  loadIngredients().filter((i) => i.isMainIngredient);

export const loadIngredientMap = (): Map<string, string> => {
  const map = new Map<string, string>();
  for (const ing of loadIngredients()) {
    if (ing.isMainIngredient) map.set(ing.id, ing.name);
  }
  return map;
};
```

- [ ] **Step 3: ingredients.ts를 JSON import 방식으로 교체**

`src/shared/config/seo/ingredients.ts`를 수정하여 JSON에서 읽도록 한다:

```typescript
// src/shared/config/seo/ingredients.ts
import ingredientsData from "./ingredients.json";

export type SeoIngredient = {
  id: string;
  name: string;
  isMainIngredient: boolean;
  tier?: 1 | 2 | 3;
};

export const ALL_INGREDIENTS: SeoIngredient[] = ingredientsData as SeoIngredient[];
export const MAIN_INGREDIENTS: SeoIngredient[] = ALL_INGREDIENTS.filter(
  (i) => i.isMainIngredient
);
```

- [ ] **Step 4: ingredients.ts를 import하는 모든 파일이 여전히 동작하는지 확인**

Run: `npx tsc --noEmit`
Expected: PASS (MAIN_INGREDIENTS 내보내기 이름 유지됨)

- [ ] **Step 5: 커밋**

```bash
git add src/shared/config/seo/ingredients.json src/shared/config/seo/ingredients.ts scripts/lib/load-ingredients.ts
git commit -m "refactor(seo): extract ingredients to JSON, remove regex parsing dependency"
```

---

## Task 4: seo-discover.ts에 공통 유틸 적용

**Files:**
- Modify: `scripts/seo-discover.ts`

- [ ] **Step 1: import 변경 + 로컬 중복 코드 제거**

파일 상단의 상수/유틸 선언(lines 13~67)을 공통 모듈 import로 교체:

```typescript
// 기존 lines 13~67 전체 삭제하고 아래로 교체:
import {
  API_BASE,
  CONCURRENCY,
  DELAY_MS,
  MAX_ERROR_RATE,
  MIN_RESULTS,
  DATA_DIR,
  ALLOWLIST_PATH,
  ARCHIVE_PATH,
  SEEN_PATH,
  today,
} from "./lib/seo-constants";
import {
  type ParamSet,
  sleep,
  paramsToKey,
  fetchResultCount,
} from "./lib/seo-utils";

const LOG_PATH = path.join(DATA_DIR, `discover-log-${today()}.json`);
```

나머지 코드에서 로컬 `fetchResultCount`, `paramsToKey`, `sleep`, `ParamSet` 타입 선언을 삭제한다. 함수 시그니처가 동일하므로 호출부는 변경 불필요.

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-discover.ts
git commit -m "refactor(seo): use shared utils in seo-discover.ts"
```

---

## Task 5: seo-discover-keywords.ts에 공통 유틸 적용

**Files:**
- Modify: `scripts/seo-discover-keywords.ts`

- [ ] **Step 1: import 변경 + 로컬 중복 코드 제거**

파일 상단(lines 13~58)을 공통 모듈 import로 교체:

```typescript
// 기존 lines 13~58 삭제하고 아래로 교체:
import {
  CONCURRENCY,
  DELAY_MS,
  MIN_RESULTS,
  DATA_DIR,
  ALLOWLIST_PATH,
  today,
} from "./lib/seo-constants";
import {
  type ParamSet,
  sleep,
  paramsToKey,
  fetchResultCount,
  safeReadJson,
} from "./lib/seo-utils";

const LOG_PATH = path.join(DATA_DIR, `discover-keywords-log-${today()}.json`);
```

`fetchResultCount`는 이제 string을 직접 받을 수 있으므로 기존 keyword 전용 `fetchResultCount(q: string)` 호출부가 그대로 동작한다.

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-discover-keywords.ts
git commit -m "refactor(seo): use shared utils in seo-discover-keywords.ts"
```

---

## Task 6: seo-audit.ts에 공통 유틸 적용

**Files:**
- Modify: `scripts/seo-audit.ts`

- [ ] **Step 1: import 변경 + 로컬 중복 코드 제거**

파일 상단의 상수(lines 14~21)와 `classifyCategory`(lines 66~89), `fetchResultCount`(lines 93~135)를 공통 모듈로 교체:

```typescript
// 기존 상수 선언과 유틸 함수 삭제 후:
import {
  CONCURRENCY,
  DELAY_MS,
  MAX_ERROR_RATE,
  MIN_RESULTS,
  DATA_DIR,
  today,
} from "../scripts/lib/seo-constants";
import {
  sleep,
  fetchResultCount,
  classifyCategory,
} from "../scripts/lib/seo-utils";
```

주의: `seo-audit.ts`의 `classifyCategory`는 `hasNutrition` 체크가 포함되어 있고, 공통 유틸 버전에도 이를 포함시켰으므로 동작이 동일하다.

`DELAY_BETWEEN_BATCH_MS`는 `DELAY_MS`로 통일 (동일 값 100).
`RETRY_BACKOFF_MS`는 `RETRY_BACKOFF`로 통일 (동일 값 [1000, 3000, 10000]).
`MIN_RESULTS_FOR_ACTIVE`는 `MIN_RESULTS`로 통일 (동일 값 8).

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-audit.ts
git commit -m "refactor(seo): use shared utils in seo-audit.ts"
```

---

## Task 7: seo-report.ts에 공통 유틸 적용

**Files:**
- Modify: `scripts/seo-report.ts`

- [ ] **Step 1: 로컬 classifyCategory 삭제 + import 교체**

```typescript
// 기존 lines 14~38 (ParamSet 타입 + classifyCategory) 삭제 후:
import {
  ALLOWLIST_PATH,
  ARCHIVE_PATH,
  DATA_DIR,
} from "./lib/seo-constants";
import {
  type ParamSet,
  classifyCategory,
  CATEGORY_LABELS,
  safeReadJson,
} from "./lib/seo-utils";
```

`classifyCategory`가 영문 코드를 반환하므로, 출력 시 `CATEGORY_LABELS[code]`로 한글 라벨을 사용한다.

카테고리별 집계 출력 부분(lines 88~93)을 수정:

```typescript
for (const [cat, count] of sorted) {
  const label = CATEGORY_LABELS[cat] ?? cat;
  const bar = "█".repeat(Math.ceil(count / (pages.length / 30)));
  console.log(`  ${label.padEnd(20)} ${String(count).padStart(6)}  ${bar}`);
}
```

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-report.ts
git commit -m "refactor(seo): use shared classifyCategory in seo-report.ts"
```

---

## Task 8: seo-trend-gsc.ts에 공통 classifyCategory 적용

**Files:**
- Modify: `scripts/seo-trend-gsc.ts`

- [ ] **Step 1: 로컬 분류 로직 삭제 + import**

파일 내 카테고리 분류 로직(URL 패턴에서 params 추출 후 분류하는 부분)을 공통 `classifyCategory` import로 교체.

```typescript
import { classifyCategory, CATEGORY_LABELS } from "./lib/seo-utils";
```

기존 인라인 분류 코드를 삭제하고 `classifyCategory(params)` 호출로 교체.

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-trend-gsc.ts
git commit -m "refactor(seo): use shared classifyCategory in seo-trend-gsc.ts"
```

---

## Task 9: seo-classify.ts — regex 파싱 제거, JSON 로드로 교체

**Files:**
- Modify: `scripts/seo-classify.ts`

- [ ] **Step 1: loadIngredients를 JSON 기반으로 교체**

기존 `loadIngredients()` 함수(lines 50~62)를 삭제하고:

```typescript
import { loadIngredientMap } from "./lib/load-ingredients";
```

사용부에서 `loadIngredients()` → `loadIngredientMap()` 으로 교체. 반환 타입이 동일 (`Map<string, string>`)하므로 호출부 변경 없음.

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-classify.ts
git commit -m "refactor(seo): replace regex ingredient parsing with JSON in seo-classify.ts"
```

---

## Task 10: seo-optimize.ts — JSON 직접 수정 + 하드코딩 제거

**Files:**
- Modify: `scripts/seo-optimize.ts`

- [ ] **Step 1: 전체 재작성**

regex로 TS 파일을 수정하는 방식을 완전히 제거하고, `ingredients.json`을 직접 읽고 쓰는 방식으로 교체:

```typescript
/**
 * SEO 최적화 스크립트 — 분석 리포트의 재료 Tier를 ingredients.json에 반영
 *
 * 실행: npx tsx scripts/seo-optimize.ts
 * 선행: npx tsx scripts/seo-classify.ts
 */

import * as fs from "fs";
import { DATA_DIR, INGREDIENTS_JSON_PATH } from "./lib/seo-constants";
import { loadIngredients, type IngredientEntry } from "./lib/load-ingredients";
import * as path from "path";

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
  fs.writeFileSync(INGREDIENTS_JSON_PATH, JSON.stringify(ingredients, null, 2), "utf-8");

  const totalIngredients = ingredients.length;
  console.log("=== ingredients.json 업데이트 완료 ===");
  console.log(`Tier 1: ${report.tierSummary.tier1Count}개`);
  console.log(`Tier 2: ${report.tierSummary.tier2Count}개`);
  console.log(`Tier 3: ${report.tierSummary.tier3Count}개`);
  console.log(
    `Tier 미분류 (양념류 등): ${totalIngredients - tierMap.size}개`
  );
  console.log(`\n저장: ${INGREDIENTS_JSON_PATH}`);
};

main();
```

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-optimize.ts
git commit -m "refactor(seo): replace regex TS modification with direct JSON update in seo-optimize.ts"
```

---

## Task 11: seo-trend-naver.ts — division by zero 수정 + sleep 공통화

**Files:**
- Modify: `scripts/seo-trend-naver.ts`

- [ ] **Step 1: calcTrendDirection의 division by zero 수정**

기존 (line 114):
```typescript
const change = prev > 0 ? (recent - prev) / prev : 0;
```

이미 guard가 있지만, `prev`가 정확히 0일 때만 보호됨. 실제로는 `prev`가 매우 작은 양수일 때도 문제가 될 수 있으므로 최소값을 적용:

```typescript
const calcTrendDirection = (
  data: Array<{ ratio: number }>
): "rising" | "stable" | "declining" => {
  if (data.length < 4) return "stable";
  const recent = data.slice(-2).reduce((a, b) => a + b.ratio, 0) / 2;
  const prev = data.slice(-4, -2).reduce((a, b) => a + b.ratio, 0) / 2;
  if (prev < 0.01) return recent > 0.01 ? "rising" : "stable";
  const change = (recent - prev) / prev;
  if (change > 0.15) return "rising";
  if (change < -0.15) return "declining";
  return "stable";
};
```

- [ ] **Step 2: sleep을 공통 유틸에서 import**

```typescript
import { sleep } from "./lib/seo-utils";
```

파일 내 로컬 `sleep` 선언(line 98) 삭제.

- [ ] **Step 3: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: 커밋**

```bash
git add scripts/seo-trend-naver.ts
git commit -m "fix(seo): guard division by zero in trend calculation, use shared sleep"
```

---

## Task 12: sitemap.ts — 라우트 캐싱으로 중복 생성 제거

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: buildAllRoutes를 한 번만 실행하도록 캐싱**

```typescript
import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

const SITE_URL = SEO_CONSTANTS.SITE_URL;
const SITEMAP_CHUNK_SIZE = 10000;

// allowlist = source of truth
let allowlistPages: Array<Record<string, string | number>> = [];
try {
  const allowlist = require("@/shared/config/seo/sitemap-allowlist.json");
  allowlistPages = allowlist.pages || [];
} catch {
  // allowlist 없으면 빈 배열
}

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/search`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/recipes/my-fridge`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/ingredients`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
];

// 캐시: 한 번만 빌드
let _cachedRoutes: MetadataRoute.Sitemap | null = null;

const buildAllRoutes = (): MetadataRoute.Sitemap => {
  if (_cachedRoutes) return _cachedRoutes;

  const routes: MetadataRoute.Sitemap = [...staticRoutes];

  for (const params of allowlistPages) {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();

    routes.push({
      url: `${SITE_URL}/search/results?${qs.replace(/&/g, "&amp;")}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  _cachedRoutes = routes;
  return routes;
};

export async function generateSitemaps() {
  const total = staticRoutes.length + allowlistPages.length;
  const count = Math.ceil(total / SITEMAP_CHUNK_SIZE);
  return Array.from({ length: count }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const allRoutes = buildAllRoutes();
  const start = id * SITEMAP_CHUNK_SIZE;
  return allRoutes.slice(start, start + SITEMAP_CHUNK_SIZE);
}
```

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add src/app/sitemap.ts
git commit -m "perf(seo): cache sitemap routes to avoid rebuilding per chunk"
```

---

## Task 13: health check 병렬화

**Files:**
- Modify: `scripts/seo-health/run.ts`

- [ ] **Step 1: 독립적인 체크를 Promise.all로 병렬 실행**

```typescript
import { checkRobots } from "./checks/robots.js";
import {
  checkSitemaps,
  checkSitemapUrlCountDrop,
  pickRecipeSampleUrls,
  pickRandomSampleUrls,
} from "./checks/sitemap.js";
import { checkOgTags } from "./checks/ogTags.js";
import { checkJsonLd } from "./checks/jsonLd.js";
import { checkCanonical } from "./checks/canonical.js";
import { checkLighthouseSeo } from "./checks/lighthouse.js";
import { checkRecipeMeta } from "./checks/recipeMeta.js";
import { config } from "./config.js";
import { reportAndExit } from "./reporter.js";
import type { CheckResult, Tier } from "./types.js";

const parseTier = (): Tier => {
  const tierIdx = process.argv.indexOf("--tier");
  const tier = tierIdx >= 0 ? process.argv[tierIdx + 1] : "daily";

  if (tier !== "daily" && tier !== "deep") {
    console.error(`Invalid tier: ${tier}. Use --tier daily or --tier deep`);
    process.exit(1);
  }

  return tier;
};

const main = async () => {
  const tier = parseTier();
  console.log(`Running SEO health check (tier: ${tier})\n`);

  // Step 1: robots.txt + sitemaps 병렬 실행 (독립적)
  console.log("Checking robots.txt + sitemaps...");
  const [robotsResults, { results: sitemapResults, allUrls }] =
    await Promise.all([checkRobots(), checkSitemaps()]);

  const allResults: CheckResult[] = [...robotsResults, ...sitemapResults];

  // Step 2: 샘플 구성
  const recipeSampleUrls = pickRecipeSampleUrls(allUrls);
  const fixedSamplePages = [...config.samplePages, ...recipeSampleUrls];
  const randomUrls = pickRandomSampleUrls(allUrls);

  console.log(
    `Sample pages: ${fixedSamplePages.length} fixed + ${randomUrls.length} random`
  );

  // Step 3: OG + JSON-LD + Canonical + Random OG 병렬 실행 (모두 독립적 HTTP 요청)
  console.log("Checking OG tags, JSON-LD, canonical, random samples...");
  const [ogResults, jsonLdResults, canonicalResults, randomResults] =
    await Promise.all([
      checkOgTags(fixedSamplePages),
      checkJsonLd(fixedSamplePages),
      checkCanonical(fixedSamplePages),
      checkOgTags(randomUrls),
    ]);

  allResults.push(...ogResults, ...jsonLdResults, ...canonicalResults, ...randomResults);

  // Deep-only checks
  if (tier === "deep") {
    console.log("Running deep checks...");
    const lighthousePages = ["/", ...recipeSampleUrls.slice(0, 2)];

    // Lighthouse는 순차 실행 (무거움), 나머지 병렬
    const [countResults, recipeMetaResults] = await Promise.all([
      checkSitemapUrlCountDrop(allUrls),
      checkRecipeMeta(recipeSampleUrls),
    ]);
    allResults.push(...countResults, ...recipeMetaResults);

    console.log("Running Lighthouse SEO audit...");
    const lighthouseResults = await checkLighthouseSeo(lighthousePages);
    allResults.push(...lighthouseResults);
  }

  reportAndExit(allResults);
};

main().catch((err) => {
  console.error("SEO health check crashed:", err);
  process.exit(1);
});
```

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-health/run.ts
git commit -m "perf(seo): parallelize independent health checks with Promise.all"
```

---

## Task 14: JSON 파싱 안전장치 추가

**Files:**
- Modify: `scripts/seo-discover.ts`
- Modify: `scripts/seo-report.ts`

- [ ] **Step 1: seo-discover.ts의 JSON 읽기를 safeReadJson으로 교체**

기존에 `JSON.parse(fs.readFileSync(...))` 를 사용하는 부분들을 `safeReadJson`으로 교체한다.

allowlist 로드 부분:
```typescript
// 기존:
// const raw = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, "utf-8"));
// 교체:
const raw = safeReadJson<Allowlist>(ALLOWLIST_PATH);
if (!raw) {
  // 초기 실행: 빈 allowlist 생성
  // (기존 로직 유지)
}
```

archive, seen 로드도 동일하게 교체.

- [ ] **Step 2: seo-report.ts의 JSON 읽기를 safeReadJson으로 교체**

```typescript
const allowlist = safeReadJson<{ generatedAt: string; stats?: any; pages: ParamSet[] }>(ALLOWLIST_PATH);
if (!allowlist) {
  console.error("allowlist가 없습니다. 먼저 seo:discover를 실행하세요.");
  process.exit(1);
}
```

- [ ] **Step 3: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: 커밋**

```bash
git add scripts/seo-discover.ts scripts/seo-report.ts
git commit -m "fix(seo): add safe JSON parsing to prevent crashes on malformed data"
```

---

## Task 15: 키워드 전략별 전환율 추적 로그 추가

**Files:**
- Modify: `scripts/seo-discover-keywords.ts`

- [ ] **Step 1: 전략별 통계를 로그에 기록**

`generateNewKeywords()` 내 각 전략 블록에서 생성된 키워드 수를 추적하고, 검증 후 ACTIVE 전환된 수를 기록한다.

키워드 생성 시 전략 태그를 부여:

```typescript
type TaggedKeyword = { keyword: string; strategy: string };

const generateNewKeywords = (): TaggedKeyword[] => {
  const keywords: TaggedKeyword[] = [];

  // 1. 재료 × 상황 × 요리법
  // ... 기존 생성 로직 ...
  // keywords.push("김치찌개") → keywords.push({ keyword: "김치찌개", strategy: "ing_situation_method" })

  // ... 나머지 전략도 동일하게 태그 부여 ...

  return keywords;
};
```

로그 저장 시 전략별 통계 포함:

```typescript
const strategyStats: Record<string, { generated: number; active: number }> = {};
// 검증 루프에서:
for (const { keyword, strategy } of batch) {
  if (!strategyStats[strategy]) strategyStats[strategy] = { generated: 0, active: 0 };
  strategyStats[strategy].generated++;
  if (count >= MIN_RESULTS) strategyStats[strategy].active++;
}

// 로그에 추가
const logData = {
  date: today(),
  // ... 기존 필드 ...
  strategyStats,
};
```

- [ ] **Step 2: 동작 확인**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: 커밋**

```bash
git add scripts/seo-discover-keywords.ts
git commit -m "feat(seo): track per-strategy conversion rates in keyword discovery logs"
```

---

## Task 16: 최종 검증

- [ ] **Step 1: 전체 타입 체크**

Run: `npx tsc --noEmit`
Expected: PASS (또는 기존과 동일한 에러만)

- [ ] **Step 2: SEO report 실행 테스트**

Run: `npx tsx scripts/seo-report.ts`
Expected: 카테고리별 통계가 한글 라벨로 정상 출력

- [ ] **Step 3: 최종 커밋**

변경 사항 없으면 스킵. 있으면:

```bash
git add -A
git commit -m "chore(seo): final cleanup after pipeline refactoring"
```
