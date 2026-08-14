# GSC 레시피 색인 전수 조사 설계

## 목적

프로덕션 레시피 sitemap 0~3번의 URL을 Google Search Console URL Inspection API로 한 번씩 검사하고, 여러 날에 걸친 실행을 안전하게 이어가면서 최신 성공 결과를 색인 상태별 개수로 집계한다.

## 조사 범위

- 대상 sitemap
  - `https://www.recipio.kr/recipes/sitemap/0.xml`
  - `https://www.recipio.kr/recipes/sitemap/1.xml`
  - `https://www.recipio.kr/recipes/sitemap/2.xml`
  - `https://www.recipio.kr/recipes/sitemap/3.xml`
- 2026-08-14 확인 결과
  - sitemap 0: 10,000행
  - sitemap 1: 10,000행
  - sitemap 2: 10,000행
  - sitemap 3: 9,131행
  - sitemap 사이 중복: 41행
  - 중복 제거 조사 대상: 39,090개 URL
- GSC property: `sc-domain:recipio.kr`
- API: `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`

## 선택한 접근

별도 데이터베이스 의존성을 추가하지 않고, Git에서 무시되는 `docs/gsc-index-status/` 아래에 JSON inventory, append-only JSONL 이벤트 로그, 파생 summary를 둔다.

단일 JSON 파일을 요청마다 다시 쓰는 방식은 파일 크기가 커질수록 비효율적이고 중간 종료 시 손상 위험이 있다. SQLite는 트랜잭션과 조회 기능이 좋지만 현재 요구사항에는 새 런타임 의존성과 운영 복잡도가 더 크다. JSONL 이벤트 로그는 요청 전후의 사실을 순서대로 남길 수 있어 재개와 할당량 복원이 단순하며 현재 약 4만 URL 규모에 충분하다.

## 파일 구성

### 커밋 대상

- `scripts/gsc-recipe-index-audit.ts`
  - inventory 초기화, 재개, 속도 제한, 결과 기록, 요약 생성을 조율한다.
- `package.json`
  - `seo:index-audit` 명령을 추가한다.
- `scripts/__tests__/gsc-recipe-index-audit.test.ts`
  - 사용자에게 관찰되는 조사·재개·집계·안전 중단 동작을 검증한다.

기존 `scripts/lib/gsc.ts`의 인증과 URL Inspection 호출을 변경 없이 재사용한다.

### Git에서 무시되는 로컬 데이터

`/docs/`는 이미 `.gitignore` 대상이다.

```text
docs/gsc-index-status/
├── inventory.json
├── events.jsonl
└── summary.json
```

- `inventory.json`
  - 조사 ID, 생성 시각, sitemap별 행 수, 중복 수, 중복 제거된 URL과 원본 sitemap index를 저장한다.
  - 최초 조사 동안에는 불변이다.
- `events.jsonl`
  - `attempt`와 `result` 이벤트를 append-only로 저장한다.
  - 중간 종료 후 호출 횟수와 완료 URL을 복원하는 원본 데이터다.
- `summary.json`
  - 현재 inventory에 속한 URL의 최신 성공 결과를 기준으로 다시 생성하는 파생 데이터다.
  - 삭제되어도 `inventory.json`과 `events.jsonl`에서 복구할 수 있다.

인증 키, access token, refresh token은 어떤 데이터 파일에도 저장하지 않는다.

## 데이터 모델

### Inventory

```ts
type Inventory = {
  auditId: string;
  createdAt: string;
  property: "sc-domain:recipio.kr";
  sources: Array<{
    sitemapIndex: 0 | 1 | 2 | 3;
    url: string;
    rowCount: number;
  }>;
  duplicateRows: number;
  urls: Array<{
    url: string;
    sitemapIndexes: Array<0 | 1 | 2 | 3>;
  }>;
};
```

### Events

API 요청 직전에 `attempt`를 먼저 기록한다. 프로세스가 요청 도중 종료되어도 해당 호출은 최근 24시간 사용량에 포함된다.

```ts
type AttemptEvent = {
  type: "attempt";
  attemptId: string;
  auditId: string;
  url: string;
  attemptedAt: string;
};

type ResultEvent = {
  type: "result";
  attemptId: string;
  auditId: string;
  url: string;
  completedAt: string;
  httpStatus: number | null;
  outcome:
    | "success"
    | "rate_limited"
    | "auth_error"
    | "request_error"
    | "retryable_error";
  verdict?: string;
  coverageState?: string;
  indexingState?: string;
  robotsTxtState?: string;
  pageFetchState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  crawledAs?: string;
  error?: string;
};
```

API 오류 본문은 최대 300자로 제한하고 Authorization 헤더와 credential은 기록하지 않는다. 완료 URL은 `outcome === "success"`인 최신 결과가 있는 URL로 정의한다. 실패한 URL은 완료 처리하지 않아 다음 실행에서 다시 대상이 된다.

## 실행 흐름

### 초기화 실행

1. sitemap 0~3을 모두 내려받는다.
2. 각 `<loc>`을 수집하고 정확한 URL 문자열 기준으로 중복 제거한다.
3. URL이 레시피 상세 경로이고 `recipio.kr` property 아래에 있는지 검증한다.
4. 고정된 `inventory.json`을 원자적으로 저장한다.

### 조사 실행

1. GSC 인증과 property 접근 권한을 사전 확인한다.
2. 최근 24시간 호출 여유 안에서 미완료 URL을 순서대로 검사한다.
3. 실행 종료 시 `summary.json`을 원자적으로 다시 생성한다.

### 재개 실행

1. 기존 inventory와 이벤트 로그를 읽는다.
2. 최신 성공 결과가 있는 URL을 완료 집합으로 만든다.
3. 최근 24시간의 모든 `attempt`를 세어 남은 호출 여유를 계산한다.
4. inventory 순서를 유지하면서 미완료 URL부터 이어서 검사한다.
5. 완료된 URL을 다시 호출하지 않는다.

조사 기간 중 sitemap 변경으로 모집단이 흔들리지 않도록 최초 inventory를 고정한다. 새로운 sitemap 상태를 조사하는 기능은 후속 범위로 남긴다.

## 할당량과 속도 제한

Google 공식 URL Inspection 한도는 같은 사이트 기준 하루 2,000회, 분당 600회다. 이 스크립트는 외부 호출과 재시도를 위한 여유를 남긴다.

- 동시에 진행하는 요청: 1개
- 요청 시작 간 최소 간격: 250ms
- 이론상 자체 최대 속도: 분당 240회
- 최근 24시간 최대 시도: 1,800회
- 재시도도 시도 횟수에 포함
- 최근 24시간에 1,800회를 사용했으면 API를 호출하지 않고 다음 실행 가능 시각을 출력

39,090개 URL은 최대 1,800회씩 처리할 때 22개의 24시간 실행 구간이 필요하다.

같은 GSC property를 다른 프로그램이 사용하면 이 스크립트 밖의 호출량은 알 수 없다. 따라서 할당량 초과를 절대 보장하지는 않으며, 200회 여유와 429 즉시 중단으로 대응한다.

## 오류 처리

- `429`
  - 재시도하지 않는다.
  - `rate_limited` 결과를 기록하고 현재 실행을 즉시 종료한다.
- `401`, `403`
  - 인증 또는 property 권한 오류로 기록하고 즉시 종료한다.
  - URL을 완료 처리하지 않는다.
- 그 외 `4xx`
  - 재시도하지 않고 `request_error`로 기록한다.
  - 해당 URL은 완료 처리하지 않고 다음 URL을 계속 검사한다.
- 네트워크 오류와 `5xx`
  - 지수 백오프와 jitter를 적용해 최대 2회 재시도한다.
  - 각 재시도는 별도 `attempt`이며 최근 24시간 한도에 포함한다.
- 잘못된 sitemap, 빈 inventory, 로그 파싱 실패
  - GSC 호출 전에 실패한다.
  - 기존 inventory와 이벤트 로그를 덮어쓰지 않는다.
- 프로세스 강제 종료
  - 요청 전 기록된 `attempt`는 보존된다.
  - 대응하는 성공 `result`가 없으므로 URL은 다음 실행에서 다시 검사한다.

## 상태 집계

`summary.json`은 현재 inventory에 포함된 URL별 최신 성공 결과만 사용한다.

- `verdict === "PASS"`: `색인됨`
- 나머지 결과: GSC가 반환한 `coverageState` 원문별로 집계
- `coverageState`가 없는 성공 결과: `(coverageState 없음)`으로 집계
- API 실패는 색인 상태에 섞지 않고 별도 실패 개수로 표시

요약에는 다음 값을 포함한다.

- 전체 고유 URL 수
- 검사 완료 수
- 남은 URL 수
- 색인됨 수
- `coverageState`별 색인 제외 수
- API 실패 수와 마지막 실패 원인별 개수
- 최초 검사 시각과 최근 검사 시각
- 최근 24시간 시도 수와 다음 실행 가능 시각

검사 완료 수는 모든 색인 상태 개수의 합과 같아야 한다.

## 명령 인터페이스

첫 구현은 다음 세 동작만 제공한다.

```text
npm run seo:index-audit -- --init
npm run seo:index-audit -- --run
npm run seo:index-audit -- --summary
```

- `--init`: sitemap 0~3으로 inventory를 만든다. 기존 inventory가 있으면 덮어쓰지 않고 종료한다.
- `--run`: 인증을 확인하고 남은 URL을 제한 범위에서 검사한 뒤 요약한다.
- `--summary`: 외부 호출 없이 저장된 데이터만 다시 집계한다.

여러 동작을 동시에 지정하거나 아무 동작도 지정하지 않으면 사용법과 함께 실패한다.

## Acceptance Criteria

1. 최초 inventory 생성 시 sitemap 0~3의 URL이 수집되고, 중복 URL은 하나의 조사 대상으로 저장되며 원본 sitemap index 정보는 보존된다.
2. 기존 inventory가 있는 상태에서 초기화를 다시 요청하면 기존 조사 데이터를 덮어쓰지 않고 종료한다.
3. 조사를 실행하면 성공한 URL은 이벤트 로그에 남고, 다음 실행에서는 해당 URL을 다시 호출하지 않는다.
4. 요청 도중 프로세스가 종료되어도 이미 기록된 시도가 최근 24시간 사용량에서 빠지지 않고, 성공 결과가 없는 URL은 다음 실행의 미완료 대상으로 남는다.
5. 어떤 실행도 이 스크립트가 기록한 최근 24시간 시도 1,800회를 넘겨 새 요청을 시작하지 않으며, 연속 요청 시작 간격은 250ms 이상이다.
6. 429가 반환되면 추가 요청 없이 현재 실행을 종료하고, 401 또는 403이 반환되면 기존 결과를 유지한 채 권한 오류로 종료한다.
7. 요약을 생성하면 URL별 최신 성공 결과 하나만 사용되어 `색인됨`과 `coverageState`별 개수가 표시되고, 그 합은 검사 완료 수와 같다.
8. 스크립트의 출력 파일과 로그에는 인증 키와 token이 포함되지 않는다.
9. sitemap 또는 이벤트 로그가 올바르지 않으면 기존 조사 데이터를 덮어쓰지 않고 GSC 호출 전에 실패한다.

## 범위 밖

- 레시피 sitemap 4번 이상
- 일반 페이지·재료·다국어 sitemap
- GSC Search Analytics 데이터 결합
- 실시간 URL 검사와 색인 요청
- cron, GitHub Actions 등 자동 스케줄러
- 웹 대시보드
- 완료된 URL의 정기 재검사와 새 조사 생성
- 다른 프로세스가 소비한 GSC 할당량 추적

## 출처

- Google Search Console API 사용 한도: <https://developers.google.com/webmaster-tools/limits>
- URL Inspection API: <https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect>
