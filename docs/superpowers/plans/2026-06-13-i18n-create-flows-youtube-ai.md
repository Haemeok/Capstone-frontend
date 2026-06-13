# 유튜브 추출 · AI 생성 데이터 현지화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ja/en 사용자가 유튜브 추출·AI 생성을 실행할 때 생성 요청에 active locale의 `lang`이 실려 결과 데이터가 현지화되도록 한다.

**Architecture:** 클라이언트 api 함수(`createExtractionJobV2`/`checkYoutubeDuplicate`/`createAIRecipeJobV2`)와 서버 `getTrendingYoutubeRecipesOnServer`에 `lang` 파라미터를 추가하고, `ko`이면 쿼리에서 생략한다(읽기 흐름과 동일 패턴). job은 persist 후 재시도 시점에 호출되므로 locale을 **enqueue 시점에 캡처해 job에 저장**하고 제출·재시도 두 호출부가 그 값을 쓴다. active locale은 이미 존재하는 `useApiLocale()`(pathname 우선 → 저장값 fallback → ko)에서 얻는다.

**Tech Stack:** Next.js 15 App Router, TypeScript, TanStack Query, Zustand, Jest.

**범위 주의:** 재료 fetch 슬라이스(슬라이스 1)는 병렬 작업이 소유 → 이 plan에서 제외. `useApiLocale`/`resolveLocaleFromPath`는 이미 `src/shared/i18n/`에 존재하므로 재사용만 한다(신규 생성 task 없음).

**테스트 설계 매트릭스:** `docs/superpowers/specs/2026-06-13-i18n-create-flows-data-test-design.md` (T-09 ~ T-15만 이 plan 소관).

---

## File Structure

| 파일 | 책임 | 변경 |
| --- | --- | --- |
| `src/features/recipe-import-youtube/model/api.ts` | 유튜브 추출/중복체크 호출 | `lang` 파라미터 추가 |
| `src/features/recipe-import-youtube/model/__tests__/api.lang.test.ts` | 추출/체크 lang 계약 | 신규 |
| `src/entities/recipe/model/api.server.ts` | trending 서버 fetch | `getTrendingYoutubeRecipesOnServer(lang)` |
| `src/entities/recipe/model/__tests__/getTrendingYoutubeRecipesOnServer.lang.test.ts` | trending lang 계약 | 신규 |
| `src/features/recipe-import-youtube/model/types.ts` | PersistedJob | `locale` 필드 |
| `src/features/recipe-import-youtube/model/store.ts` | createJob | locale 저장 |
| `src/app/recipes/new/youtube/components/YoutubePreviewSection.tsx` | 추출 제출 | locale 캡처·전달 |
| `src/features/recipe-import-youtube/model/jobPollingHandlers.tsx` | 추출 재시도 | `job.locale` 전달 |
| `src/features/recipe-import-youtube/model/hooks.ts` | 중복체크 훅 | locale 전달 + queryKey |
| `src/features/recipe-create-ai/model/api.ts` | AI 생성 호출 | `lang` 파라미터 추가 |
| `src/features/recipe-create-ai/model/__tests__/api.lang.test.ts` | AI 생성 lang 계약 | 신규 |
| `src/features/recipe-create-ai/model/types.ts` | PersistedAIJob | `locale` 필드 |
| `src/features/recipe-create-ai/model/store.ts` | createJob | locale 저장 |
| `src/features/recipe-create-ai/model/useConceptJob.ts` | AI 제출 | locale 캡처·전달 |
| `src/features/recipe-create-ai/model/useAIJobPolling.tsx` | AI 재시도 | `job.locale` 전달 |

---

## Task 1: 유튜브 추출/중복체크 api가 lang을 싣는다 (T-09, T-10, T-12)

**Files:**
- Modify: `src/features/recipe-import-youtube/model/api.ts`
- Test: `src/features/recipe-import-youtube/model/__tests__/api.lang.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { api } from "@/shared/api/client";

import { checkYoutubeDuplicate, createExtractionJobV2 } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: {
    get: jest.fn(async () => ({})),
    post: jest.fn(async () => ({ jobId: "job-1" })),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("youtube extraction api lang (T-09/T-10/T-12)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("T-09: ja 추출 시 extract params에 lang=ja", async () => {
    await createExtractionJobV2("https://youtu.be/x", "key-1", undefined, "ja");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/youtube/extract",
      null,
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });

  it("T-09: en 추출 시 extract params에 lang=en", async () => {
    await createExtractionJobV2("https://youtu.be/x", "key-1", undefined, "en");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/youtube/extract",
      null,
      expect.objectContaining({
        params: expect.objectContaining({ lang: "en" }),
      })
    );
  });

  it("T-12: ko 추출 시 extract params에 lang 없음", async () => {
    await createExtractionJobV2("https://youtu.be/x", "key-1", undefined, "ko");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/youtube/extract",
      null,
      expect.objectContaining({
        params: expect.not.objectContaining({ lang: expect.anything() }),
      })
    );
  });

  it("T-10: ja 중복체크 시 check params에 lang=ja", async () => {
    await checkYoutubeDuplicate("https://youtu.be/x", "ja");
    expect(mockedApi.get).toHaveBeenCalledWith(
      "/dev/recipes/youtube/check",
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja" }),
      })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/features/recipe-import-youtube/model/__tests__/api.lang.test.ts`
Expected: FAIL — `lang`이 params에 없음 (현재 시그니처에 lang 파라미터 없음).

- [ ] **Step 3: Write minimal implementation**

`src/features/recipe-import-youtube/model/api.ts` 상단 import에 추가:

```ts
import type { Locale } from "@/shared/i18n";
```

`checkYoutubeDuplicate`와 `createExtractionJobV2`를 교체:

```ts
export const checkYoutubeDuplicate = async (
  url: string,
  lang: Locale = "ko"
): Promise<YoutubeDuplicateCheckResponse> => {
  return api.get<YoutubeDuplicateCheckResponse>("/dev/recipes/youtube/check", {
    params: { url, ...(lang === "ko" ? {} : { lang }) },
  });
};

export const createExtractionJobV2 = async (
  url: string,
  idempotencyKey: string,
  imageGenModel: ImageGenModel = DEFAULT_IMAGE_GEN_MODEL,
  lang: Locale = "ko"
): Promise<JobCreationResponse> => {
  return api.post<JobCreationResponse>("/dev/recipes/youtube/extract", null, {
    params: { url, imageGenModel, ...(lang === "ko" ? {} : { lang }) },
    headers: { "Idempotency-Key": idempotencyKey },
  });
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/features/recipe-import-youtube/model/__tests__/api.lang.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/recipe-import-youtube/model/api.ts src/features/recipe-import-youtube/model/__tests__/api.lang.test.ts
git commit -m "feat(i18n): youtube extract/check carry active-locale lang (T-09/10/12)" -- src/features/recipe-import-youtube/model/api.ts src/features/recipe-import-youtube/model/__tests__/api.lang.test.ts
```

---

## Task 2: trending 서버 fetch가 lang을 싣는다 (T-11)

**Files:**
- Modify: `src/entities/recipe/model/api.server.ts:422-447`
- Test: `src/entities/recipe/model/__tests__/getTrendingYoutubeRecipesOnServer.lang.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
/**
 * @jest-environment node
 */
import { getTrendingYoutubeRecipesOnServer } from "../api.server";

describe("getTrendingYoutubeRecipesOnServer lang (T-11)", () => {
  const fetchMock = jest.fn(
    async () => new Response(JSON.stringify([]), { status: 200 })
  );

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockClear();
  });

  it("T-11: lang=ja면 trending fetch URL에 lang=ja", async () => {
    await getTrendingYoutubeRecipesOnServer("ja");
    expect(String(fetchMock.mock.calls[0][0])).toContain("lang=ja");
  });

  it("T-11: lang 미지정/ko면 URL에 lang 키 없음", async () => {
    await getTrendingYoutubeRecipesOnServer();
    expect(String(fetchMock.mock.calls[0][0])).not.toContain("lang=");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/entities/recipe/model/__tests__/getTrendingYoutubeRecipesOnServer.lang.test.ts`
Expected: FAIL — 현재 함수가 인자를 받지 않고 URL에 lang을 안 붙임.

- [ ] **Step 3: Write minimal implementation**

`src/entities/recipe/model/api.server.ts`의 `getTrendingYoutubeRecipesOnServer`를 교체. (파일 상단에 `Locale` 타입이 이미 import돼 있지 않으면 `import type { Locale } from "@/shared/i18n";` 추가 — 같은 파일의 `getLocalizedRecipeOnServer`가 `locale: "ja" | "en"`을 쓰므로 확인 후 없을 때만 추가.)

```ts
export const getTrendingYoutubeRecipesOnServer = async (
  lang?: Locale
): Promise<TrendingYoutubeRecipe[]> => {
  const url = new URL(`${BASE_API_URL}${END_POINTS.RECIPE_YOUTUBE_RECOMMEND}`);
  if (lang && lang !== "ko") url.searchParams.set("lang", lang);

  try {
    const res = await fetch(url.toString(), {
      next: {
        revalidate: REVALIDATION_TIMES.RECIPES_TRENDING,
        tags: [CACHE_TAGS.recipesTrending],
      },
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(
      "[getTrendingYoutubeRecipesOnServer] Failed to fetch trending recipes:",
      error
    );
    return [];
  }
};
```

> 주의: 기존 본문의 `return res.json();` 위치/형태는 현재 파일(428-446)을 그대로 따른다. 위 블록에서 `if (!res.ok) return [];` 다음의 정상 반환부가 현재 코드와 동일한지 확인하고 `url.toString()` 적용 + lang 분기만 더한다. `/ja` 유튜브 페이지가 이 함수에 `"ja"`를 넘기는 라우트 와이어링은 로컬라이즈드 라우트(별도/병렬 작업)가 소유 — 이 task는 함수 계약만 만든다(AC2-4의 페이지 결합은 그 라우트 존재에 의존).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/entities/recipe/model/__tests__/getTrendingYoutubeRecipesOnServer.lang.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/entities/recipe/model/api.server.ts src/entities/recipe/model/__tests__/getTrendingYoutubeRecipesOnServer.lang.test.ts
git commit -m "feat(i18n): trending youtube server fetch carries lang in URL (T-11)" -- src/entities/recipe/model/api.server.ts src/entities/recipe/model/__tests__/getTrendingYoutubeRecipesOnServer.lang.test.ts
```

---

## Task 3: 유튜브 job에 locale을 저장하고 제출·재시도·중복체크에 전달 (wiring)

**테스트 없음** — 컴포넌트/스토어 글루는 test-design owner-layer 규칙상 계약 테스트(T-09/T-10)가 소유. 이 task는 순수 와이어링이며 `npx tsc --noEmit`로만 검증한다.

**Files:**
- Modify: `src/features/recipe-import-youtube/model/types.ts:40-47`
- Modify: `src/features/recipe-import-youtube/model/store.ts:20`, `:49-64`
- Modify: `src/app/recipes/new/youtube/components/YoutubePreviewSection.tsx:161`, `:170-173`
- Modify: `src/features/recipe-import-youtube/model/jobPollingHandlers.tsx:135`
- Modify: `src/features/recipe-import-youtube/model/hooks.ts:23-39`

- [ ] **Step 1: PersistedJob에 locale 추가**

`types.ts` 상단에 `import type { Locale } from "@/shared/i18n";` 추가 후 `PersistedJob`을 교체:

```ts
export type PersistedJob = {
  idempotencyKey: string;
  url: string;
  meta: YoutubeMeta;
  jobId: string | null;
  startTime: number;
  lastPollTime: number;
  retryCount: number;
  locale: Locale;
};
```

- [ ] **Step 2: store createJob 시그니처에 locale 추가**

`store.ts`의 `YoutubeImportStoreV2` 타입 선언(20행)을 교체:

```ts
  createJob: (url: string, meta: YoutubeMeta, locale: Locale) => string;
```

`store.ts` 상단에 `import type { Locale } from "@/shared/i18n";` 추가. `createJob` 구현(49행~)을 교체:

```ts
    createJob: (url, meta, locale) => {
      const existingJob = get().getJobByUrl(url);
      if (existingJob) {
        return existingJob.idempotencyKey;
      }

      const idempotencyKey = generateIdempotencyKey();
      const now = Date.now();

      const persistedJob: PersistedJob = {
        idempotencyKey,
        url,
        meta,
        jobId: null,
        startTime: now,
        lastPollTime: now,
        retryCount: 0,
        locale,
      };

      const activeJob: ActiveJob = {
        ...persistedJob,
        state: "creating",
        progress: 0,
      };

      addPersistedJob(persistedJob);

      set((state) => ({
        jobs: {
          ...state.jobs,
          [idempotencyKey]: activeJob,
        },
      }));

      return idempotencyKey;
    },
```

- [ ] **Step 3: 제출부에서 locale 캡처·전달**

`YoutubePreviewSection.tsx` 상단 import에 추가:

```ts
import { useApiLocale } from "@/shared/i18n";
```

컴포넌트 본문 상단(다른 훅들 옆)에 추가:

```ts
  const locale = useApiLocale();
```

`createJob` 호출(161행)을 교체:

```ts
    const idempotencyKey = createJob(validatedUrl, youtubeMeta, locale);
```

`createExtractionJobV2` 호출(170-173행)을 교체:

```ts
      const { jobId } = await createExtractionJobV2(
        validatedUrl,
        idempotencyKey,
        undefined,
        locale
      );
```

- [ ] **Step 4: 재시도부에서 job.locale 전달**

`jobPollingHandlers.tsx`의 재시도 호출(135행)을 교체:

```ts
    const response = await createExtractionJobV2(
      job.url,
      job.idempotencyKey,
      undefined,
      job.locale
    );
```

- [ ] **Step 5: 중복체크 훅에서 locale 전달 + queryKey 분리**

`hooks.ts` 상단 import에 추가:

```ts
import { useApiLocale } from "@/shared/i18n";
```

`useYoutubeDuplicateCheck`를 교체:

```ts
export const useYoutubeDuplicateCheck = (url: string | null) => {
  const locale = useApiLocale();
  return useQuery<YoutubeDuplicateCheckResponse>({
    queryKey: ["youtube-duplicate-check", url, locale],
    queryFn: () => {
      if (!url) return Promise.resolve({});
      return checkYoutubeDuplicate(url, locale);
    },
    enabled: !!url,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
```

- [ ] **Step 6: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음. (createJob 다른 호출부가 있으면 locale 누락 에러가 뜨므로 모두 전달하도록 수정.)

- [ ] **Step 7: 기존 유튜브 테스트 회귀 확인**

Run: `npx jest src/features/recipe-import-youtube`
Expected: PASS. (store/persistence 테스트가 createJob을 부르면 3번째 인자 `"ko"`를 추가해 갱신.)

- [ ] **Step 8: Commit**

```bash
git add src/features/recipe-import-youtube/model/types.ts src/features/recipe-import-youtube/model/store.ts src/app/recipes/new/youtube/components/YoutubePreviewSection.tsx src/features/recipe-import-youtube/model/jobPollingHandlers.tsx src/features/recipe-import-youtube/model/hooks.ts
git commit -m "feat(i18n): capture active locale on youtube job, thread to submit/retry/duplicate-check" -- src/features/recipe-import-youtube/model/types.ts src/features/recipe-import-youtube/model/store.ts src/app/recipes/new/youtube/components/YoutubePreviewSection.tsx src/features/recipe-import-youtube/model/jobPollingHandlers.tsx src/features/recipe-import-youtube/model/hooks.ts
```

---

## Task 4: AI 생성 api가 lang을 싣는다 (T-13, T-14, T-15)

**Files:**
- Modify: `src/features/recipe-create-ai/model/api.ts`
- Test: `src/features/recipe-create-ai/model/__tests__/api.lang.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { api } from "@/shared/api/client";

import type { IngredientFocusRequest } from "../types";
import { createAIRecipeJobV2 } from "../api";

jest.mock("@/shared/api/client", () => ({
  api: { post: jest.fn(async () => ({ jobId: "ai-1" })) },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const request = {
  type: "INGREDIENT_FOCUS",
  ingredients: ["감자"],
} as unknown as IngredientFocusRequest;

describe("AI recipe api lang (T-13/T-14/T-15)", () => {
  beforeEach(() => jest.clearAllMocks());

  it("T-13: ja 생성 시 params에 lang=ja", async () => {
    await createAIRecipeJobV2(request, "INGREDIENT_FOCUS", "key-1", undefined, "ja");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja", concept: "INGREDIENT_FOCUS" }),
      })
    );
  });

  it("T-13: en 생성 시 params에 lang=en", async () => {
    await createAIRecipeJobV2(request, "INGREDIENT_FOCUS", "key-1", undefined, "en");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.objectContaining({ lang: "en" }),
      })
    );
  });

  it("T-14: concept가 FINE_DINING이어도 lang=ja 그대로 부착", async () => {
    await createAIRecipeJobV2(request, "FINE_DINING", "key-1", undefined, "ja");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.objectContaining({ lang: "ja", concept: "FINE_DINING" }),
      })
    );
  });

  it("T-15: ko 생성 시 params에 lang 없음", async () => {
    await createAIRecipeJobV2(request, "INGREDIENT_FOCUS", "key-1", undefined, "ko");
    expect(mockedApi.post).toHaveBeenCalledWith(
      "/dev/recipes/ai",
      { aiRequest: request },
      expect.objectContaining({
        params: expect.not.objectContaining({ lang: expect.anything() }),
      })
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/features/recipe-create-ai/model/__tests__/api.lang.test.ts`
Expected: FAIL — 현재 시그니처에 lang 파라미터 없음.

- [ ] **Step 3: Write minimal implementation**

`src/features/recipe-create-ai/model/api.ts` 상단 import에 추가:

```ts
import type { Locale } from "@/shared/i18n";
```

`createAIRecipeJobV2`를 교체:

```ts
export const createAIRecipeJobV2 = async (
  aiRequest: AIRecommendedRecipeRequest,
  concept: AIModelId,
  idempotencyKey: string,
  imageGenModel: ImageGenModel = DEFAULT_IMAGE_GEN_MODEL,
  lang: Locale = "ko"
): Promise<AIJobCreationResponse> => {
  return api.post<AIJobCreationResponse>(
    "/dev/recipes/ai",
    { aiRequest },
    {
      params: { concept, imageGenModel, ...(lang === "ko" ? {} : { lang }) },
      headers: { "Idempotency-Key": idempotencyKey },
    }
  );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/features/recipe-create-ai/model/__tests__/api.lang.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/recipe-create-ai/model/api.ts src/features/recipe-create-ai/model/__tests__/api.lang.test.ts
git commit -m "feat(i18n): AI recipe generation carries active-locale lang (T-13/14/15)" -- src/features/recipe-create-ai/model/api.ts src/features/recipe-create-ai/model/__tests__/api.lang.test.ts
```

---

## Task 5: AI job에 locale을 저장하고 제출·재시도에 전달 (wiring)

**테스트 없음** — 글루. 계약 테스트(T-13)가 소유. `npx tsc --noEmit`로만 검증.

**Files:**
- Modify: `src/features/recipe-create-ai/model/types.ts:71-82`
- Modify: `src/features/recipe-create-ai/model/store.ts:99-103`, `:140`(createJob 본문)
- Modify: `src/features/recipe-create-ai/model/useConceptJob.ts:53-58`
- Modify: `src/features/recipe-create-ai/model/useAIJobPolling.tsx:158-162`

- [ ] **Step 1: PersistedAIJob에 locale 추가**

`types.ts` 상단에 `import type { Locale } from "@/shared/i18n";` 추가 후 `PersistedAIJob`을 교체:

```ts
export type PersistedAIJob = {
  idempotencyKey: string;
  concept: AIModelId;
  meta: AIJobMeta;
  request: AIRecommendedRecipeRequest;
  jobId: string | null;
  startTime: number;
  lastPollTime: number;
  retryCount: number;
  locale: Locale;
};
```

- [ ] **Step 2: store createJob 시그니처·본문에 locale 추가**

`store.ts` 상단에 `import type { Locale } from "@/shared/i18n";` 추가. 타입 선언(99-103행)을 교체:

```ts
  createJob: (
    concept: AIModelId,
    request: AIRecommendedRecipeRequest,
    meta: AIJobMeta,
    locale: Locale
  ) => string;
```

`createJob` 구현(140행~)의 시그니처와 persist 객체에 locale을 반영. 구현 본문에서 `PersistedAIJob`을 만드는 객체 리터럴에 `locale,`을 추가하고, 함수 시그니처를 `createJob: (concept, request, meta, locale) => {` 로 교체한다. (현재 본문은 `getJobByConcept` 가드 후 idempotencyKey/now를 만들고 persist 객체를 구성 — 그 객체에 `locale` 필드만 더한다.)

- [ ] **Step 3: 제출부에서 locale 캡처·전달**

`useConceptJob.ts` 상단 import의 i18n 라인을 교체:

```ts
import { useApiLocale, useT } from "@/shared/i18n";
```

훅 본문에서 `const t = useT();` 옆에 추가:

```ts
  const locale = useApiLocale();
```

`submit` 콜백 내부의 `createJob`·`createAIRecipeJobV2` 호출(53-58행)을 교체:

```ts
      const idempotencyKey = createJob(concept, request, meta, locale);
      try {
        const response = await createAIRecipeJobV2(
          request,
          concept,
          idempotencyKey,
          undefined,
          locale
        );
```

`submit`의 `useCallback` deps 배열에 `locale`을 추가:

```ts
    [concept, createJob, setJobId, failJob, modelName, locale]
```

- [ ] **Step 4: 재시도부에서 job.locale 전달**

`useAIJobPolling.tsx`의 재시도 호출(158-162행)을 교체:

```ts
        const response = await createAIRecipeJobV2(
          job.request,
          job.concept,
          job.idempotencyKey,
          undefined,
          job.locale
        );
```

- [ ] **Step 5: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음. (createJob 다른 호출부가 있으면 locale 누락 에러 → 모두 전달.)

- [ ] **Step 6: 기존 AI 테스트 회귀 확인**

Run: `npx jest src/features/recipe-create-ai`
Expected: PASS. (`useConceptJob.test`/`store.test`가 createJob을 부르면 4번째 인자 `"ko"` 추가해 갱신.)

- [ ] **Step 7: Commit**

```bash
git add src/features/recipe-create-ai/model/types.ts src/features/recipe-create-ai/model/store.ts src/features/recipe-create-ai/model/useConceptJob.ts src/features/recipe-create-ai/model/useAIJobPolling.tsx
git commit -m "feat(i18n): capture active locale on AI job, thread to submit/retry" -- src/features/recipe-create-ai/model/types.ts src/features/recipe-create-ai/model/store.ts src/features/recipe-create-ai/model/useConceptJob.ts src/features/recipe-create-ai/model/useAIJobPolling.tsx
```

---

## Self-Review 체크 (작성자 확인 완료)

- **추적성:** T-09(Task1) · T-10(Task1) · T-11(Task2) · T-12(Task1) · T-13(Task4) · T-14(Task4) · T-15(Task4) 모두 실패 테스트로 매핑됨. wiring task(3,5)는 test-design이 글루를 명시적 무테스트로 표기 → owner는 계약 테스트. 슬라이스 1(T-01/02/05/06)은 병렬 작업 소유로 이 plan 범위 밖.
- **placeholder 없음:** 모든 코드 스텝에 실제 코드 포함.
- **타입 일관성:** `createExtractionJobV2(url, key, imageGenModel?, lang?)` / `createAIRecipeJobV2(req, concept, key, imageGenModel?, lang?)` / `createJob(..., locale)` 시그니처가 제출·재시도·테스트에서 동일하게 사용됨. `lang === "ko" ? {} : { lang }` ko-생략 규칙이 네 호출 지점에 동일 적용.
