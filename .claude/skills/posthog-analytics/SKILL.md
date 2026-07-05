---
name: posthog-analytics
description: Use when the user asks to analyze production traffic or PostHog metrics, investigate bot/scraper suspicion, explain a visitor spike or metric anomaly, or run HogQL/SQL against analytics data. Runs HogQL via the PostHog Query API using `node scripts/posthog-query.mjs`. Includes the mandatory IP-verification workflow that must run before any block/WAF recommendation.
---

# posthog-analytics

Recipio 프로덕션 PostHog(US Cloud)에 HogQL을 날려 트래픽 분석·이상 탐지·지표 요약을 수행한다.

## 실행

```bash
node scripts/posthog-query.mjs "SELECT event, count() FROM events WHERE timestamp > now() - interval 1 day GROUP BY event ORDER BY count() DESC LIMIT 10"
node scripts/posthog-query.mjs --file tmp-query.sql
```

- 멀티라인/따옴표 섞인 긴 쿼리는 `--file`로. 임시 `.sql` 파일은 작업 후 삭제.
- 출력은 `{ rowCount, rows: [{column: value}] }` JSON.

필요 env (`.env.local`, gitignored):

| 변수                       | 값                                              |
| -------------------------- | ----------------------------------------------- |
| `POSTHOG_PERSONAL_API_KEY` | Personal API key, **scope는 `query:read` 단독** |
| `POSTHOG_PROJECT_ID`       | PostHog Settings → Project → ID (숫자)          |
| `POSTHOG_API_HOST`         | 선택, 기본 `https://us.posthog.com`             |

env 미설정이면 스크립트가 명시적 에러로 죽는다 → 사용자에게 키 발급 안내 (PostHog → Settings → Personal API Keys → `query:read`만 체크).

## HogQL 기초

- 주 테이블: `events`. 페이지뷰는 `event = '$pageview'`.
- 자주 쓰는 속성: `properties.$pathname`, `properties.$ip`, `properties.$os`, `properties.$screen_width`, `properties.$referrer`(`$direct` = 직접 유입), `properties.$current_url`, `properties.$raw_user_agent`
- 사람 수는 `count(DISTINCT distinct_id)`.
- **항상 `timestamp > now() - interval N day`로 기간 제한** (무기간 전체 스캔 금지).
- `LIMIT` 필수. 탐색은 20~50부터.

## 정형 분석 레시피

**공통 규칙: 트래픽 리포트 쿼리엔 항상 봇 제외 필터를 넣는다** (PostHog internal-user 필터가 설정돼 있어도 이중 안전):

```sql
AND NOT (properties.$ip LIKE '211.249.46.%'
      OR properties.$ip LIKE '110.93.150.%'
      OR properties.$ip LIKE '114.111.32.%')
```

### 일별 트래픽 요약 (방문자·PV·세션)

```sql
SELECT toDate(timestamp) AS day,
       count() AS pageviews,
       count(DISTINCT distinct_id) AS visitors,
       count(DISTINCT properties.$session_id) AS sessions
FROM events
WHERE event = '$pageview' AND timestamp > now() - interval 7 day
  AND NOT (properties.$ip LIKE '211.249.46.%' OR properties.$ip LIKE '110.93.150.%' OR properties.$ip LIKE '114.111.32.%')
GROUP BY day ORDER BY day
```

### Bounce rate · 세션 길이 (`sessions` 테이블)

```sql
SELECT toDate($start_timestamp) AS day,
       count() AS sessions,
       round(avg($is_bounce) * 100, 1) AS bounce_pct,
       round(avg(dateDiff('second', $start_timestamp, $end_timestamp)), 0) AS avg_duration_s
FROM sessions
WHERE $start_timestamp > now() - interval 7 day
GROUP BY day ORDER BY day
```

- `sessions` 테이블엔 `$entry_pathname`, `$exit_pathname`, `$channel_type`, `$pageview_count` 등도 있음. 필드명이 에러 나면 `SELECT * FROM sessions LIMIT 1`로 스키마부터 확인.
- `sessions` 테이블은 IP 필터가 안 먹을 수 있음 → 봇 오염 의심 기간은 events 기반 수치와 교차 확인.

### 플랫폼/디바이스 세그먼트 분해

```sql
SELECT properties.$os AS os,
       properties.$device_type AS device,
       count() AS pageviews,
       count(DISTINCT distinct_id) AS visitors
FROM events
WHERE event = '$pageview' AND timestamp > now() - interval 7 day
  AND NOT (properties.$ip LIKE '211.249.46.%' OR properties.$ip LIKE '110.93.150.%' OR properties.$ip LIKE '114.111.32.%')
GROUP BY os, device ORDER BY pageviews DESC
```

세그먼트별 행동 특성 비교(인기 경로, 세션 깊이)는 위에 `properties.$pathname` 차원을 추가하고 os별 ORDER BY. "iOS vs Android 유저 특성" 류 요청은 ① 볼륨 분해 → ② 세그먼트별 top 경로 → ③ bounce/체류 비교 순으로 3쿼리 묶어 한 리포트로 보고.

### 기간 대비 비교 (지난주 vs 이번주)

같은 쿼리를 `timestamp BETWEEN` 두 구간으로 두 번 돌려 diff를 표로 보고. 변화율 ±20% 넘는 항목만 하이라이트.

### 로케일별 페이지뷰 (ja/en은 프리픽스, ko는 나머지)

ja·en은 `/ja`·`/en` 라우터 프리픽스가 있지만 **ko는 프리픽스 없는 기본**이라, ko = 전체에서 ja·en 빼야 한다. 예약 단일세그먼트(`new`·`my-fridge`)는 상세로 오인되니 제외. 카테고리·생성 하위경로는 `[^/]+$` 가 알아서 거른다(세그먼트 더 있음).

```sql
-- 레시피 상세 페이지뷰, 로케일별, 최근 3일(오늘 포함, KST 기준)
SELECT toDate(timestamp) AS day,
  countIf(match(properties.$pathname,'^/ja/recipes/[^/]+$') AND properties.$pathname NOT IN ('/ja/recipes/new','/ja/recipes/my-fridge')) AS ja,
  countIf(match(properties.$pathname,'^/en/recipes/[^/]+$') AND properties.$pathname NOT IN ('/en/recipes/new','/en/recipes/my-fridge')) AS en,
  countIf(match(properties.$pathname,'^/recipes/[^/]+$')    AND properties.$pathname NOT IN ('/recipes/new','/recipes/my-fridge'))       AS ko
FROM events
WHERE event='$pageview' AND timestamp >= toStartOfDay(now()) - interval 2 day
  AND NOT (properties.$ip LIKE '211.249.46.%' OR properties.$ip LIKE '110.93.150.%' OR properties.$ip LIKE '114.111.32.%')
GROUP BY day ORDER BY day
```

- `match()` = ClickHouse re2 정규식(룩어헤드 불가 → 예약경로는 `NOT IN`으로 명시 제외).
- 날짜 경계: PostHog 프로젝트 TZ가 KST라 `toDate`/`toStartOfDay`가 KST 기준. `toStartOfDay(now()) - interval 2 day` = 오늘 포함 3 캘린더일.
- 패턴 의심되면 `properties.$pathname LIKE '%/recipes/%'` 로 실제 경로 샘플 먼저 확인.

### 봇/이상 트래픽 헌팅

봇 시그니처 3종을 순서대로 본다:

1. **events ≈ people** (쿠키 미유지 무상태 클라이언트): 디바이스 조합별 `count()` vs `count(DISTINCT distinct_id)` 비교. 정상 유저는 events ≫ people.
2. **단일 screen_width 집중** + `$referrer = '$direct'`
3. **경로 전수 순회**: 의심 조합으로 `$pathname` 분포를 보면, 콘텐츠 크롤러는 수많은 상세 ID에 4~5회씩 균등 분포 / 모니터링 봇은 한두 경로 집중.

```sql
SELECT properties.$screen_width AS w, properties.$os AS os,
       count() AS events, count(DISTINCT distinct_id) AS people
FROM events
WHERE event = '$pageview' AND timestamp > now() - interval 2 day
GROUP BY w, os ORDER BY events DESC LIMIT 20
```

### IP 검증 워크플로 (차단 판단 전 **필수**)

봇으로 보여도 차단을 제안하기 전에 반드시 소유자 확인:

1. HogQL로 의심 트래픽의 `properties.$ip` 추출 (위 시그니처 조건으로 필터)
2. `curl "http://ip-api.com/json/<ip>?fields=status,country,isp,org,as,asname,reverse"` 로 ASN/역DNS 확인
3. 역DNS가 크롤러 호스트네임이면 `nslookup <hostname>` 으로 forward-confirm (같은 IP로 되돌아와야 진짜)
4. 검색엔진/메신저 프리뷰 등 verified crawler 대역이면 **차단 제안 금지** — PostHog internal-user 필터로 지표만 정화

**알려진 무해 대역 (2026-06 실사고, [[naver-yeti-crawl-burst]]):** 네이버 Yeti 렌더링 크롤러 = `211.249.46.x` / `110.93.150.x` / `114.111.32.x`, AS23576 NAVER Cloud, 역DNS `crawl.*.web.naver.com`. 시그니처: width 800 / Windows / `$direct` / events=people / 레시피 ID 전수 순회. 일반 Chrome UA로 JS를 실행해서 PostHog 기본 봇필터를 통과한다.

## 메타 규칙 — 새 데이터 폼은 명령어를 새로 추가한다 (always-on)

사용자가 **위 "정형 분석 레시피"에 없는 새로운 형태**의 데이터를 요청하면:

1. 그 요청에 맞는 HogQL을 작성해 답을 뽑고,
2. **검증된 그 쿼리를 이 파일의 레시피 절에 새 항목으로 바로 추가**한다. 다음엔 그대로 재사용.
3. 새로 알게 된 속성·함정도 한 줄 추가.

즉 이 스킬은 쓸수록 레시피 카탈로그가 자라야 한다. GA4 원시 이벤트 교차검증이 필요하면 [[ga4-bigquery]] (별개 소스 대조로 "수집 문제 vs 진짜 트래픽 변화" 판별).

## 보안·운영 수칙

- API 키 값을 출력·echo·커밋하지 않는다. 키 노출 의심 시 즉시 사용자에게 회전 권고.
- 이 스킬의 산출물은 **분석과 보고까지**. WAF 차단·rate limit 변경 등 트래픽/과금에 영향 주는 조치는 근거를 정리해 사용자 결정에 맡긴다.
- PII(이메일·닉네임 등)가 결과에 섞이면 집계/요약만 보고하고 원문 나열하지 않는다.
- 쿼리 비용 의식: 긴 기간 × 고카디널리티 GROUP BY 조합은 기간을 좁혀 단계적으로.
