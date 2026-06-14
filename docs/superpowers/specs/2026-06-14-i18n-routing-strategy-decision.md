# 결정 기록(ADR) — i18n 라우팅 전략: custom 골격 유지 vs next-intl

> 작성일: 2026-06-14 · 상태: **채택(custom 유지)** · 재검토 트리거 아래 명시

## 결정

**지금은 경량 custom i18n 골격을 유지**한다. 명령형 라우팅의 locale 누락 구멍만
`useLocalizedRouter`(얇은 래퍼) + eslint 룰로 막는다. **next-intl로의 전환은 보류**하되,
아래 트리거가 충족되면 정식 안건으로 재평가한다.

## 배경

- i18n은 라이브러리 없이 자체 골격으로 구현: `getDictionary`(서버) + `DictionaryProvider`/`useT`(클라),
  `messages/{ko,ja,en}/*`(타입드), `LocalizedLink`/`localizedHref`/`stripLocale`/`useApiLocale`.
- 라우팅 구조: **ko는 무prefix 루트**(`/recipes/...`), **ja/en은 물리적 미러 라우트**(`app/ja/*`, `app/en/*`).
- 발견된 버그: 명령형 `router.push/replace`가 하드코딩 경로를 써서 locale prefix를 떨굼
  (ja 모드에서 AI 선택 → ko 라우트로 샘). 앱 전체에 raw `router.push/replace` 약 64곳.
  `LocalizedLink`는 `<Link>`만 자동 prefix하고 명령형 router는 커버 못 함.

## 검토한 고민들 (의사결정 근거)

1. **SEO/GSC** — next-intl이 ko에도 `/ko/`를 강제해 기존 색인이 틀어질 거란 우려. **→ 무효.**
   next-intl `localePrefix: 'as-needed'` + `defaultLocale: 'ko'`면 **ko URL은 무prefix 그대로**,
   ja/en만 prefix. `localeDetection: false`면 쿠키/Accept-Language 자동 리다이렉트도 없음.
   즉 SEO는 전환을 막는 이유가 **아니다**(오해는 `'always'` 기본값에서 비롯).

2. **재발명 우려** — custom이 next-intl의 `createNavigation`(Link/useRouter/redirect 래퍼)을
   조각조각 재구현하는 셈. **→ 사실이나, 골격이 이미 ~80% 완성**되어 굴러감. 남은 한계비용은
   `useLocalizedRouter` ~30줄 + lint로 작음. "처음부터 재발명"이 아니라 "마지막 살 하나".

3. **번역 자산** — ja/en 번역 70%+ 완료. 메시지의 `{var}` 보간·`{one,other}` 복수형이
   next-intl ICU와 사실상 1:1 대응이라 **전환해도 문자열은 거의 그대로 생존**. 번역은 비용이 아님.

4. **렌더링/캐시 (결정적 변수)** — custom에서 **ko 페이지는 i18n 이전과 구조적으로 동일**:
   `getDictionary("ko")`는 동기 인메모리 read라 `headers()/cookies()` 같은 request-scoped API를
   안 쓰고, **정적 렌더링/ISR이 그대로 보존**된다(static-by-default). 반면 next-intl은 **서버
   컴포넌트에서 번역 API를 쓰면 기본이 dynamic 렌더링**(locale을 `headers()`로 읽음)이고, 이를
   막으려면 **모든 page/layout에 `setRequestLocale(locale)`** 를 배선해야 한다(opt-in-static).
   이 프로젝트는 `getDictionary`를 서버에서 43곳 쓰므로 직격 — 전환 시 **멀쩡한 ko 페이지까지
   setRequestLocale 의존**이 되어 ISR 풀림 위험에 노출된다.

5. **lint 등가성 반론과 그 한계** — "setRequestLocale도 lint로 강제하면 useRouter 래핑과 같지
   않냐"는 타당한 지적. 격차는 좁혀지나 **완전 등가는 아님**:
   - 실패 양상: 래퍼 누락 = **눈에 보이는** 잘못된 locale 링크(즉시 발견) vs setRequestLocale
     누락 = **침묵하는 ISR 손실**(UI 정상, build/profiling으로만 발견).
   - 룰 신뢰도: raw `useRouter` 금지 = `no-restricted-imports`로 **airtight** vs
     "존재+순서까지 보는 setRequestLocale 룰" = **커스텀 AST**(false negative 여지).
   - 적용 범위: 래퍼 룰은 명령형 nav 일부 vs setRequestLocale은 **전 page/layout 의무(ko 포함)**.

6. **현 동적 페이지 규모** — 실제로 동적 관리가 필요한 페이지는 소수(레시피 상세·큐레이션·홈
   ~3개 추정)라 ISR 관리 부담 자체가 작음. build 출력이 페이지별 렌더 모드를 보여줘 침묵 손실도
   일부 탐지 가능 → custom의 우위를 다소 약화시키는 요인.

## 결정 드라이버

- **당분간 ja만** 확장(소수 locale). custom에서 locale 추가 비용 = 얇은 래퍼 + 정적 배선으로
  현재는 감당 가능.
- 진행 중 **i18n 대량 롤아웃 + 병렬 작업**과 충돌하지 않음(전환은 disruption이 큼).
- 위 4·5번 때문에 custom은 **ko static-by-default**라는 실재 이점을 유지(단순 sunk cost 아님).

## next-intl 재검토 트리거 (이 중 하나라도 충족 시)

1. **locale이 다수로 확장**(여러 국가 추가) — 추가마다 래퍼+정적 배선을 손수 늘려야 하므로
   누적 비용이 커지면 `[locale]` 단일 구조가 유리.
2. **ICU 날짜/숫자/복잡 복수형** 포매팅이 여러 locale에서 본격 필요해질 때.
3. **i18n 롤아웃이 freeze**되어 안전한 마이그레이션 창이 열릴 때.

재검토 시 전제: `localePrefix: 'as-needed'` + `localeDetection: false`(ko URL·정적성 최대 보존),
`app/[locale]` 재구조화 + 모든 page/layout `setRequestLocale` 배선 + 메시지 ICU 변환 비용 산정.

## 채택에 따른 작업 (consequence)

- `useLocalizedRouter`(클라 훅): `localizedHref(path, useChromeLocale())`로 push/replace/prefetch를
  자동 prefix. `LocalizedLink`의 명령형 대칭짝. ko는 no-op, http/#/이미-prefix는 가드로 통과.
- eslint 룰: `next/navigation`의 raw `useRouter` 직접 사용 금지 → `useLocalizedRouter` 유도.
  좁은 opt-out(admin 데스크톱 ko 전용 등)은 `eslint-disable` + 사유로 허용.
- 마이그레이션: 깨진 create/AI 동선부터. 나머지 명령형 nav는 병렬 롤아웃이 안정된 뒤 스윕
  (룰은 그동안 warn으로 두어 CI를 막지 않되 신규 코드를 유도).
