---
name: ga4-bigquery
description: Recipio 프로덕션 GA4 원시 이벤트를 BigQuery(Standard SQL)로 분석한다. 국가/유입/이벤트/페이지 분석, GA4 실시간 이상 교차검증. PostHog와 별개 소스 — 두 소스 대조로 "수집 문제 vs 진짜 트래픽 변화"를 가린다. GA4·BigQuery·bq·analytics_ 데이터셋·실시간 사용자 관련 작업 시 사용.
metadata:
  node_type: skill
---

# ga4-bigquery

GA4(`NEXT_PUBLIC_GA_ID`, `src/app/GoogleAnalytics.tsx`)의 원시 이벤트가 **BigQuery 일별 export**로 들어온다. 그걸 SQL로 분석한다. [[posthog-analytics]]와 **별개 소스** — 둘을 대조하면 "GA4 수집이 빠진 건지, 진짜 트래픽이 변한 건지"를 가를 수 있다(실사례: GA4 실시간 급락 → PostHog는 평소대로 → GA4 수집 문제로 확정).

## 실행 (이것만 쓰면 됨)

```bash
node scripts/ga4-query.mjs "SELECT event_date, COUNT(DISTINCT user_pseudo_id) AS users FROM {events} GROUP BY event_date ORDER BY event_date"
node scripts/ga4-query.mjs --file tmp-query.sql
```

- `{events}` → 와일드카드 테이블 `` `react-craft-2dd07.analytics_459701433.events_*` `` 로 자동 치환. 백틱·풀경로 직접 타지 말 것.
- 출력은 `{ rowCount, rows: [{column: value}] }` JSON. (PostHog 스크립트와 동일 포맷)
- 멀티라인/따옴표 섞인 긴 쿼리는 `--file`로. 임시 `.sql`은 작업 후 삭제.
- 설정값(다른 프로젝트/데이터셋 필요 시): `GA4_BQ_PROJECT` / `GA4_BQ_DATASET` / `GA4_BQ_LOCATION` env로 override.

### 왜 스크립트인가 — `bq` CLI는 Windows에서 깨진다 (직접 호출 금지)

- `bq.cmd query`는 내부에서 python을 **공백 포함 경로**(`...\Cloud SDK\...`)로 부르다 깨진다 (`'C:\...\Google\Cloud'은(는) 명령이 아닙니다`). `bq.cmd ls`는 되는데 `query`만 깨지는 게 함정.
- Node에서 `.cmd`를 `execFileSync`로 띄우면 Node 24+가 `EINVAL`로 거부 → 셸 경유(`execSync`)에 경로를 따옴표로 감싸야 함.
- 그래서 스크립트는 **gcloud로 액세스 토큰만 받고 BigQuery REST API를 직접** 친다. 인증은 `ehdnjswls234@gmail.com` gcloud 로그인에 의존. 토큰 만료/`reauth` 에러 시 사용자에게 `gcloud auth login` 재실행 요청.

## 데이터 위치·신선도

- 프로젝트 `react-craft-2dd07` / 데이터셋 `analytics_459701433` / 리전 `asia-northeast3`.
- **일별 export만 켜져 있음(스트리밍/intraday 아님).** 어제까지의 `events_YYYYMMDD`만 존재, **오늘치 테이블은 다음 날 생긴다.** → 오늘의 실시간 이상은 BigQuery로 직접 못 본다. 오늘 일별 테이블(`events_<오늘>`)은 내일 확인.
- `events_*` 와일드카드는 모든 날짜를 스캔하니, 기간을 좁히려면 `_TABLE_SUFFIX BETWEEN '20260627' AND '20260629'` 를 WHERE에 추가.

## GA4 스키마 기초 (PostHog/HogQL과 다름 — nested)

- 한 행 = 이벤트 1건. 사람 수는 `COUNT(DISTINCT user_pseudo_id)`.
- `event_name`(`page_view`, `session_start`, `first_visit`, `scroll`, `user_engagement`, `click` 등), `event_date`(`'YYYYMMDD'` 문자열), `event_timestamp`(마이크로초).
- 지리: `geo.country`, `geo.city`. 디바이스: `device.category`, `device.operating_system`, `device.web_info.browser`.
- 유입: `traffic_source.source`, `traffic_source.medium`. 페이지/세션 등 대부분은 **`event_params` 배열 UNNEST**로 꺼냄:

```sql
-- 이벤트 파라미터 꺼내는 표준 패턴 (page_location, ga_session_id, page_title 등)
(SELECT value.string_value FROM UNNEST(event_params) WHERE key='page_location') AS page_location
(SELECT value.int_value    FROM UNNEST(event_params) WHERE key='ga_session_id')  AS session_id
```

- 스키마 의심되면 `SELECT * FROM {events} LIMIT 1` 로 먼저 확인.
- 봇 필터: GA4는 Google이 알려진 봇을 자체 제외하지만 Yeti 등은 통과할 수 있음. 의심 시 PostHog와 교차검증([[posthog-analytics]]의 Yeti 대역 참고).

## 자주 쓰는 쿼리

### 일별 사용자·페이지뷰

```sql
SELECT event_date,
       COUNT(DISTINCT user_pseudo_id) AS users,
       COUNTIF(event_name='page_view') AS page_views,
       COUNT(*) AS events
FROM {events}
GROUP BY event_date ORDER BY event_date
```

### 국가별 유입 (최근 데이터)

```sql
SELECT geo.country AS country,
       COUNT(DISTINCT user_pseudo_id) AS users,
       COUNTIF(event_name='page_view') AS page_views
FROM {events}
GROUP BY country ORDER BY users DESC LIMIT 20
```

### 인기 페이지 (page_location UNNEST)

```sql
SELECT (SELECT value.string_value FROM UNNEST(event_params) WHERE key='page_location') AS page,
       COUNT(*) AS views
FROM {events}
WHERE event_name='page_view'
GROUP BY page ORDER BY views DESC LIMIT 30
```

### 유입 소스/매체

```sql
SELECT traffic_source.source AS source, traffic_source.medium AS medium,
       COUNT(DISTINCT user_pseudo_id) AS users
FROM {events}
GROUP BY source, medium ORDER BY users DESC LIMIT 20
```

### 디바이스/OS 분해

```sql
SELECT device.category AS device, device.operating_system AS os,
       COUNT(DISTINCT user_pseudo_id) AS users, COUNT(*) AS events
FROM {events}
GROUP BY device, os ORDER BY users DESC
```

### 이벤트 종류별 볼륨

```sql
SELECT event_name, COUNT(*) AS events, COUNT(DISTINCT user_pseudo_id) AS users
FROM {events}
GROUP BY event_name ORDER BY events DESC
```

## GA4 실시간 이상 진단 레시피 (실사례)

"GA4 실시간 사용자가 평소보다 적다" → BigQuery는 오늘치가 없으니 **PostHog를 실시간 진실값으로** 쓴다:

1. PostHog 최근 30분 활성 사용자(Yeti 제외) 확인 — GA4 실시간이 보는 "최근 30분"과 같은 창.
2. PostHog **오늘 vs 어제 시간대별** 대조(Yeti 제외) — 같은 시각 사용자수가 비슷하면 **진짜 트래픽은 정상**.
3. 둘 다 정상인데 GA4 실시간만 낮으면 → **GA4 수집/표시 문제**(Google 처리지연·동의모드·데이터필터·gtag 미발화). 트래픽 문제 아님.
4. `git log -- src/app/GoogleAnalytics.tsx` 로 태그 코드 최근 변경 확인.
5. 내일 `events_<오늘>` 일별 테이블 사용자수가 평소 수준이면 → 오늘은 실시간 UI/처리지연이었다고 사후 확정.

## 메타 규칙 — 새 데이터 폼은 명령어를 새로 추가한다 (always-on)

사용자가 **위 "자주 쓰는 쿼리"에 없는 새로운 형태**의 데이터를 요청하면:

1. 그 요청에 맞는 쿼리를 작성해 답을 뽑고,
2. **검증된 그 쿼리를 이 파일의 "자주 쓰는 쿼리"(또는 PostHog면 [[posthog-analytics]])에 새 항목으로 바로 추가**한다. 다음엔 그대로 재사용.
3. 새로 알게 된 스키마 필드·UNNEST 패턴·함정도 해당 절에 한 줄 추가.

즉 이 스킬은 쓸수록 명령어 카탈로그가 자라야 한다. "이번만 쓰고 버리는" 일회성 쿼리로 끝내지 말 것.

## 보안·운영 수칙

- 액세스 토큰·API 키를 출력·echo·커밋하지 않는다.
- 산출물은 **분석·보고까지**. 차단·rate limit 등 트래픽/과금 영향 조치는 근거 정리 후 사용자 결정에 맡긴다.
- PII가 결과에 섞이면 집계/요약만 보고, 원문 나열 금지.
- 긴 기간 × 와일드카드 풀스캔은 비용. `_TABLE_SUFFIX`로 날짜 좁혀 단계적으로.
