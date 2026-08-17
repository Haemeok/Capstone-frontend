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

### 오늘 로케일 × Yeti·네이버 유입·앱 사용자 분해

로케일은 사용자가 실제로 본 URL 경로 기준이다. 세그먼트 우선순위는 Yeti → 네이버 유입 → 리시피오 앱 → 기타 웹이다. 네이버 검색 결과에서 연 인앱 브라우저는 referrer가 후속 페이지에서 사라질 수 있으므로 `NAVER(inapp` UA도 함께 잡는다. 앱 사용자는 UA 추정 대신 `PostHogAppContext`가 등록하는 `properties.is_native_app = true`를 사용한다.

```sql
SELECT
  multiIf(match(properties.$pathname, '^/ja(/|$)'), 'ja',
          match(properties.$pathname, '^/en(/|$)'), 'en', 'ko') AS locale,
  multiIf(properties.$raw_user_agent LIKE '%Yeti%'
            OR properties.$ip LIKE '211.249.46.%'
            OR properties.$ip LIKE '110.93.150.%'
            OR properties.$ip LIKE '114.111.32.%', 'yeti',
          properties.$referrer LIKE '%naver.com%'
            OR properties.$raw_user_agent LIKE '%NAVER(inapp%', 'naver_inflow',
          properties.is_native_app = true, 'recipio_app',
          'other_web') AS segment,
  count() AS pageviews,
  count(DISTINCT distinct_id) AS visitors,
  count(DISTINCT properties.$session_id) AS sessions,
  count(DISTINCT properties.$pathname) AS unique_paths
FROM events
WHERE event = '$pageview'
  AND timestamp >= toStartOfDay(now())
GROUP BY locale, segment
ORDER BY locale, pageviews DESC
LIMIT 30
```

- 같은 `distinct_id`가 하루 중 여러 로케일이나 세그먼트를 오가면 각 행에 중복 집계될 수 있다. 언어별 실제 사람 합계가 필요하면 Yeti와 확인된 자동화를 제외한 뒤 로케일만으로 다시 `count(DISTINCT distinct_id)` 한다.
- 조사 중인 자동화 출처가 있으면 `multiIf`에서 네이버 유입보다 앞에 일회성 세그먼트 조건을 추가해 일반 웹 수치를 오염시키지 않는다.

### 특정 크롤러의 크롤 예산 분해 (Yeti가 ja/en을 얼마나 긁나)

크롤러를 IP 대역이 아니라 **`properties.$raw_user_agent`로 잡는다** — Yeti는 UA에 `Yeti` 문자열이 그대로 들어있고, IP 대역 3종보다 커버리지가 넓다(21일 기준 UA 184,220 vs IP 182,739 → IP 필터만 쓰면 ~1.5k 누락). 봇 제외 필터를 뒤집어 `LIKE '%Yeti%'`를 조건으로 쓰면 됨.

```sql
-- 크롤러의 로케일별 히트 + 고유 경로 수 (최근 3주)
SELECT multiIf(match(properties.$pathname,'^/ja(/|$)'),'ja',
               match(properties.$pathname,'^/en(/|$)'),'en','ko') AS locale,
       count() AS hits,
       count(DISTINCT properties.$pathname) AS unique_paths
FROM events
WHERE event='$pageview' AND timestamp > now() - interval 21 day
  AND properties.$raw_user_agent LIKE '%Yeti%'
GROUP BY locale ORDER BY hits DESC
```

- `hits / unique_paths ≈ 1.0` 이면 재크롤이 아니라 **ID 공간 전수 순회 중**(신규 발견 위주). 4~5면 같은 문서 반복 크롤.
- 경로 종류 분해는 `multiIf(match(...,'^/(ja|en)/recipes/[^/]+$'),'recipe detail', ...)` 로 한 번 더. 예상 밖 경로는 `concat('other: ', properties.$pathname)` 로 흘려서 정체 확인.
- noindex/robots 변경 효과를 볼 땐 일별 추이로 뽑고 **배포일과 감소 시작일을 대조**. 감소가 배포보다 앞서면 그 변경 때문이 아니다(크롤러 자체 스케줄일 수 있음). 마지막 날은 부분 집계라 감소로 오독 금지.

### Googlebot 요청을 일별·경로 유형별로 분석

Googlebot은 서버 요청을 해도 PostHog `$pageview`를 보내지 않을 수 있고, GA4는 알려진 봇을 기본 제외하며 IP·원문 UA도 내보내지 않는다. 따라서 PostHog/GA4의 0건은 **크롤 0건이 아니다**. verified Googlebot 요청 수의 기준 소스는 Vercel Edge Request 메트릭이다.

```bash
vercel metrics schema vercel.request.count --format json
vercel metrics vercel.request.count \
  -f "bot_verified eq true and bot_name eq 'Googlebot'" \
  --group-by request_path \
  --since 30d --granularity 1d --format json
```

- 필수 차원: `bot_verified`, `bot_name`, `client_ip`, `request_path`. UA 이름만으로 verified라고 부르지 않는다. Google이 공개한 common crawler CIDR 또는 forward-confirmed `*.googlebot.com` DNS와도 맞는지 확인한다.
- `vercel metrics`가 `payment_required`를 반환하면 Observability Plus가 없는 상태다. 이때 Runtime Logs로 30일 수치를 대신 만들지 않는다. Runtime Logs JSON에는 `clientUserAgent`, `requestPath`, `requestSearchParams`는 있지만 `client_ip`와 `bot_verified`가 없고, 플랜 보존기간 밖 조회는 `ExceedsBillingLimitError`가 난다.
- 페이지네이션·구형 필터가 query string으로 구분될 때는 `request_path`만으로 분리할 수 없다. 앞으로 정확히 집계하려면 Log Drain 등으로 `requestSearchParams`와 검증된 bot/IP 신호를 함께 보존해야 한다.
- 일별 표에는 마지막 날이 부분 집계임을 표시하고, 전체 기간 합계에는 완결일 합계와 당일 누계를 구분한다.

### 단일 URL 스파이크 원인 추적 ("이 페이지에 N분간 200회, 어떤 놈?")

특정 경로에 짧은 시간 트래픽이 몰렸을 때, **봇이냐 진짜 사람이냐**를 3쿼리로 가른다. 순서 고정:

```sql
-- 1) 분 단위로 스파이크 모양 + 사람/IP 분산도 확인
SELECT toStartOfMinute(timestamp) AS min, count() AS hits,
       count(DISTINCT distinct_id) AS people, count(DISTINCT properties.$ip) AS ips
FROM events
WHERE properties.$pathname LIKE '%/recipes/<id>%' AND timestamp > now() - interval 2 day
GROUP BY min ORDER BY hits DESC LIMIT 20
```

```sql
-- 2) 유입원 + 디바이스 (진짜 사람이면 referrer가 검색/SNS로 수렴)
SELECT properties.$referrer AS ref, properties.$os AS os, properties.$device_type AS device,
       count() AS hits, count(DISTINCT distinct_id) AS people
FROM events
WHERE properties.$pathname LIKE '%/recipes/<id>%'
  AND timestamp BETWEEN toDateTime('YYYY-MM-DD HH:MM:SS') AND toDateTime('YYYY-MM-DD HH:MM:SS')
GROUP BY ref, os, device ORDER BY hits DESC LIMIT 30
```

```sql
-- 3) 화면폭 분산 + UA 샘플 — 봇/사람 판정의 결정타
SELECT properties.$screen_width AS w, count() AS hits,
       count(DISTINCT distinct_id) AS people, count(DISTINCT properties.$ip) AS ips,
       topK(2)(properties.$raw_user_agent) AS ua_sample
FROM events
WHERE properties.$pathname = '/recipes/<id>'
  AND timestamp BETWEEN toDateTime('...') AND toDateTime('...')
GROUP BY w ORDER BY hits DESC LIMIT 15
```

판정 기준:

- **사람**: 화면폭 6종 이상 분산 + UA에 실기기 모델명(`SM-S931N`, `16PRO` 등) + IP가 사람 수만큼 흩어짐 + referrer가 검색엔진.
- **봇**: 단일 폭 집중 + 일반 UA + `$direct` + 경로 전수 순회(아래 봇 헌팅 절).
- `people ≈ hits`는 **단독으로는 봇 근거가 안 된다.** 검색 유입 1페이지 이탈도 같은 모양이 나온다 — 반드시 UA·폭 분산과 같이 봐야 한다.
- `event='$pageview'` 필터를 빼면 스크롤·클릭 등 부가 이벤트까지 세서 3배쯤 부풀려진다. "요청 N회"를 검증할 땐 pageview로 고정.
- 평시 기준선 대비를 꼭 붙일 것: `toStartOfHour` + `interval 14 day`로 같은 경로 히스토리를 뽑아 "원래 하루 1~3건"을 보여야 스파이크가 스파이크로 읽힌다.
- 페이지 정체는 `(Invoke-WebRequest -UseBasicParsing "https://www.recipio.kr/<path>").Content | Select-String -Pattern '<title>[^<]*</title>' -AllMatches`로 확인. 백엔드 `/api/v1/recipes/:id`는 인증 필요라 막힌다.

**네이버 앱 인앱 브라우저 UA 시그니처:** `NAVER(inapp; search; 2100; 12.22.10)` — 안드로이드는 Whale/Crosswalk 문자열이 섞이고, iOS는 끝에 기기명(`16PRO`, `12MINI`)이 붙는다. 이게 보이면 네이버 검색 결과에서 바로 탭한 실사용자다.

**실사례(2026-08-02 21:52 KST):** `/recipes/rBN7OXek`("성시경 신라면 투움바 파스타")에 3분간 pageview 238·사람 215·IP 117+. 99%가 `m.search.naver.com` 유입, 전부 네이버 인앱 UA. 평시 하루 1~3건. 밤 9시대 + 네이버 검색 + 단일 요리 = 방송 노출발 검색 폭증 패턴. 차단 대상 없음.

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

### 단일 IP의 자동 브라우저·QA 테스트 판별

한 IP에서 여러 UA가 보인다는 이유만으로 봇으로 확정하지 않는다. 가정·사무실 NAT 아래 실제 기기일 수 있다. 대신 같은 `distinct_id`가 Windows → 모바일 에뮬레이션처럼 서로 양립할 수 없는 UA로 바뀌는지, 여러 프로필이 초 단위로 동시에 같은 경로를 반복하는지, 콘텐츠 상세 외에 검색·장바구니·편집 등 기능 경로도 함께 도는지를 본다.

```sql
SELECT properties.$raw_user_agent AS ua,
       properties.$screen_width AS width,
       count() AS pageviews,
       count(DISTINCT distinct_id) AS visitors,
       count(DISTINCT properties.$session_id) AS sessions,
       count(DISTINCT properties.$pathname) AS unique_paths,
       min(timestamp) AS first_seen,
       max(timestamp) AS last_seen,
       topK(8)(properties.$pathname) AS repeated_paths
FROM events
WHERE event = '$pageview'
  AND timestamp > now() - interval 3 day
  AND properties.$ip = '<suspected-ip>'
GROUP BY ua, width
ORDER BY pageviews DESC
LIMIT 30
```

전환 속도는 pageview timestamp에 `lagInFrame(timestamp, 1, timestamp)`를 적용해 프로필별 간격을 집계한다. 1~10초 전환이 대부분이고 여러 프로필이 같은 시각·경로를 반복하면 사람의 일반 탐색보다 브라우저 자동화 가능성이 높다. 콘텐츠 상세만 넓게 한 번씩 훑으면 수집 크롤러, 기능 경로를 여러 viewport로 반복하면 QA/E2E 테스트 쪽에 가깝다.

판정 시 수집 설정을 반드시 확인한다. 이 프로젝트는 `autocapture: false`이므로 `$autocapture`·클릭 0회는 봇 근거가 아니다. `capture_pageleave: true`여도 SPA 내부 라우트 이동마다 `$pageleave`가 생기는 것은 아니므로 pageleave가 적다는 사실도 단독 근거로 쓰지 않는다.

실제 HTTP 요청 여부는 같은 경로와 시각을 Vercel request log로 대조한다. Vercel 로그에 client IP가 없으면 전체 구간 요청을 해당 IP 소행으로 귀속하지 말고, PostHog 경로 직전의 동일 경로 GET이 반복되는 수준까지만 증거로 사용한다. GA4 일별 export는 오늘치가 다음 날 생성되므로 오늘 사건의 즉시 교차검증에는 쓸 수 없다.

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
