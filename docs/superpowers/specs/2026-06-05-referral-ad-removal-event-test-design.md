# 친구 초대(광고 제거) 이벤트 — 테스트 설계

- 날짜: 2026-06-05
- 브랜치: feature/17
- 슬라이스: `docs/superpowers/specs/2026-06-05-referral-ad-removal-event-slices.md`
- 다음 단계: writing-plans (각 task의 실패 테스트는 여기 Test ID를 인용)

## 원칙 (이 프로젝트 룰 적용)

- 한 행동은 **가장 낮은 owner 레이어 한 곳**에서 소유. 상위 재검증은 owner가 구조적으로 못 잡을 때만.
- 순수 로직(시간 계산·게이트 판단·월 라벨·정규화·파생값) = **unit**. 사용자 seam(광고 분기·시트·redeem·카운트다운·OG) = **acceptance**.
- 리스크 가중 깊이: 광고/보상 = **billing/integrity → 적대적**(부정 케이스 포함). 배치/아이콘 = **cosmetic → 불변식 1개**.
- 모킹은 소유 안 한 경계만: network(api client), clipboard, bridge/`navigator.share`, time(`Date.now`/timers). 자기 모듈 모킹 금지.
- 추적 = 글로서리 단어(`showAds`/`redeem`/`RedeemStatus`/`campaignMonthLabel`/`nudge`/`myReferralCode`)를 AC·테스트명·식별자가 공유.

---

## Slice 1 — 광고 제거 게이팅 (walking skeleton)

순수 게이트 결정 함수 `resolveAdsEnabled({ adsEnabled, isTestUser, showAds })`를 owner로 추출.

**AC**
- AC-1.1: `adStatus.showAds === false`인 사용자에게는 모든 광고 슬롯이 렌더되지 않는다.
- AC-1.2: `showAds === true`이거나 `adStatus`가 없으면(로그아웃/레거시) 기존대로 광고가 노출된다.
- AC-1.3: 테스트 유저는 기존대로 광고가 노출되지 않는다(회귀 없음).

| AC | 시나리오 (Given/When/Then 요지) | Test ID | Owner | Risk |
|----|----|----|----|----|
| AC-1.1 | `showAds=false`, adsEnabled=true, testUser=false → enabled **false** | T-101 | unit | billing |
| AC-1.2 | `showAds=undefined` → enabled = adsEnabled&&!testUser (= true) | T-102 | unit | integrity |
| AC-1.3 | `showAds=true`, testUser=true → enabled **false** (testUser 우선) | T-103 | unit | billing |
| AC-1.1 | `AdsGateProvider` user.adStatus.showAds=false → 한 `AdSlot`가 아무것도 렌더 안 함 | T-110 | acceptance | billing |

## Slice 2 — 선물상자로 내 초대코드 열람·복사

`campaignMonthLabel(campaignKey)` 순수 함수 owner. 시트/액션 행은 acceptance.

**AC**
- AC-2.1: "프로필 수정"은 더 읽기 아래 풀폭 직사각형, 누르면 `/users/edit`로 이동.
- AC-2.2: 선물상자(블랙톤 Gift)를 누르면 반응형 시트가 열린다.
- AC-2.3: 헤더에 "{campaignMonthLabel}월 친구 초대 이벤트", 캠페인 없으면 "친구 초대 이벤트".
- AC-2.4: 내 초대코드 표시 + "복사" → 클립보드에 코드 복사 + 토스트.
- AC-2.5: 공유 버튼(블랙톤 Share2) → 프로필 URL(`${BASE_URL}users/{id}`)로 공유 실행.
- AC-2.6: (edge) 추천 정보 조회 중 스켈레톤, 실패 시 재시도 가능한 에러.

| AC | 시나리오 | Test ID | Owner | Risk |
|----|----|----|----|----|
| AC-2.3 | `"2026-07"` → `"7"`, `"2026-12"` → `"12"` (파라미터화) | T-201 | unit | integrity |
| AC-2.3 | `campaign=null` → 폴백 "친구 초대 이벤트" | T-202 | unit | integrity |
| AC-2.1 | 본인 프로필: "프로필 수정"이 intro 아래 풀폭 링크 `href=/users/edit` (구조 불변식 1개) | T-210 | acceptance | cosmetic |
| AC-2.2 / AC-2.3 | 선물상자 클릭 → 시트 visible + 헤더에 월 라벨 노출 | T-211 | acceptance | integrity |
| AC-2.4 | 시트의 코드 옆 "복사" 클릭 → `clipboard.writeText(myReferralCode)` 호출 + 토스트 | T-212 | acceptance | integrity |
| AC-2.5 | 공유 버튼 클릭 → `useShare`가 `${BASE_URL}users/{id}`로 호출 | T-213 | acceptance | integrity |
| AC-2.6 | referral 쿼리 loading → 스켈레톤 / error → 재시도 컨트롤 | T-214 | acceptance | cosmetic |

## Slice 3 — 추천인 코드 입력으로 광고 제거 받기 (billing — 적대적)

파생값 `canRedeem`/`remainingRewardCount`/`referrerRewardLimitReached`, 에러 매퍼 = unit. redeem 플로우 = acceptance.

**AC**
- AC-3.1: `AVAILABLE`면 입력창·적용 버튼 활성.
- AC-3.2: 유효 코드 적용 → 토스트로 `adFreeUntil` 표시 + `myInfo` 갱신으로 광고 사라짐.
- AC-3.3: 성공 후 상태가 `ALREADY_REDEEMED`(추천인 닉네임·입력일)로 전환.
- AC-3.4: `ALREADY_REDEEMED`/`NOT_ELIGIBLE_OLD_USER`/`REDEEM_WINDOW_EXPIRED`/`NO_ACTIVE_CAMPAIGN` → 입력 비활성 + 상태 문구.
- AC-3.5: 1301~1306 응답 → 각 에러 문구.
- AC-3.6: 추천인 보상 한도 도달 → 안내 문구.

| AC | 시나리오 | Test ID | Owner | Risk |
|----|----|----|----|----|
| AC-3.1/3.4 | `canRedeem`: `AVAILABLE`→true, 나머지 4개→false (파라미터화) | T-301 | unit | integrity |
| AC-3.6 | `referrerRewardLimitReached`: 3/3→true, 2/3→false; `remainingRewardCount` 경계 | T-302 | unit | integrity |
| AC-3.5 | 에러 매퍼: 1301/1302/1303 각 distinct 문구, **미지의 코드 → generic 폴백** | T-303 | unit | integrity |
| AC-3.1 | `AVAILABLE` 시트 → 입력창·적용 버튼 enabled | T-310 | acceptance | integrity |
| AC-3.2 | 유효 코드 적용 → API 성공 mock → 토스트에 `adFreeUntil` 날짜 + `['myInfo']`·`['referral']` invalidate | T-311 | acceptance | billing |
| AC-3.3 | 성공 직후 → 시트가 `ALREADY_REDEEMED`(추천인 표시)로 전환 | T-312 | acceptance | integrity |
| AC-3.4 | 4개 비-AVAILABLE 상태 → 입력 disabled + 매핑 문구 (파라미터화) | T-313 | acceptance | integrity |
| AC-3.5 | API 1303 에러 → 에러 문구 + **invalidate/성공 토스트 없음**(부정 검증) | T-314 | acceptance | billing |
| AC-3.6 | 보상 한도 도달 캠페인 → 한도 안내 문구 노출 | T-315 | acceptance | cosmetic |

## Slice 4 — 선물상자 7일 빨간불 (nudge)

`shouldShowNudge({ campaignActive, lastOpenedAt, now })` 순수 함수 owner(fake time).

**AC**
- AC-4.1: 활성 캠페인 + 연 적 없음 → 빨간불.
- AC-4.2: 열면 빨간불 사라짐.
- AC-4.3: 7일 경과 → 다시 빨간불(추천인 입력 마쳤어도 동일).
- AC-4.4: 활성 캠페인 없음 → 빨간불 없음.

| AC | 시나리오 | Test ID | Owner | Risk |
|----|----|----|----|----|
| AC-4.1 | campaignActive=true, lastOpenedAt=null → true | T-401 | unit | integrity |
| AC-4.2 | lastOpenedAt=now → false | T-402 | unit | integrity |
| AC-4.3 | lastOpenedAt=now−(7d+1s) → true; now−6d → false (경계) | T-403 | unit | integrity |
| AC-4.4 | campaignActive=false, lastOpenedAt=null → false | T-404 | unit | integrity |
| AC-4.3 | redeemed 상태여도 campaignActive=true & 7d 경과 → true | T-405 | unit | integrity |
| AC-4.1/4.2 | gift 버튼: nudge=true면 빨간 점 보이고, 클릭(open)하면 점 사라짐 | T-410 | acceptance | integrity |

## Slice 5 — 설정 탭 광고 제거 진입 + 실시간 카운트다운

`formatRemaining(ms)` 순수 = unit. `useCountdown` 틱 = hook(fake timers). 진입/표시 = acceptance.

**AC**
- AC-5.1: 설정 "광고 제거" 행 → 선물상자와 동일 시트 열림.
- AC-5.2: 활성(`adFreeUntil` 유효) → 실시간 카운트다운 1초 갱신.
- AC-5.3: 비활성 → "광고 없이 즐기기" 류 라벨.
- AC-5.4: (edge) 만료 도달 → 0에서 멈춤.

| AC | 시나리오 | Test ID | Owner | Risk |
|----|----|----|----|----|
| AC-5.2 | `formatRemaining`: 1일2시3분4초분량 ms → `"1일 02:03:04"` (포맷 불변식) | T-501 | unit | cosmetic |
| AC-5.4 | `formatRemaining`: ≤0 → `"00:00:00"` (경계) | T-502 | unit | integrity |
| AC-5.2/5.4 | `useCountdown`: 1초마다 감소, 0에서 정지(fake timers) | T-503 | hook | integrity |
| AC-5.1 | 설정 행 클릭 → referralSheet 열림 | T-510 | acceptance | integrity |
| AC-5.2/5.3 | 활성 → 행에 카운트다운 텍스트 / 비활성 → 라벨 | T-511 | acceptance | cosmetic |

## Slice 6 — 프로필 공유 링크 OG 메타데이터 (integrity)

`generateMetadata`가 곧 acceptance seam. fetch는 mock.

**AC**
- AC-6.1: 닉네임이 OG 제목.
- AC-6.2: 소개 있으면 description, 없으면 폴백.
- AC-6.3: 프로필 이미지가 OG 이미지, 없으면 폴백.

| AC | 시나리오 | Test ID | Owner | Risk |
|----|----|----|----|----|
| AC-6.1/6.2/6.3 | nickname/intro/image 있는 유저 → title=nickname, desc=intro, ogImage=profileImage | T-601 | acceptance | integrity |
| AC-6.2 | intro 없음 → 폴백 description | T-602 | acceptance | integrity |
| AC-6.3 | 이미지 없음/기본 → 폴백 이미지 | T-603 | acceptance | integrity |

## Slice 7 — 추천 보상 알림 매핑 (cosmetic)

**AC**
- AC-7.1: `REFERRAL_REWARD_GRANTED` 타입 → 전용 아이콘/스타일.
- AC-7.2: 백엔드 `message` 그대로 표시.

| AC | 시나리오 | Test ID | Owner | Risk |
|----|----|----|----|----|
| AC-7.1/7.2 | 해당 타입 알림 아이템 → 전용 아이콘 present + message 텍스트 렌더 (불변식 1개) | T-701 | acceptance | cosmetic |

---

## Coverage Gate

- 모든 AC가 ≥1 Test ID 보유 ✓ (AC-1.1~7.2 각 매핑 확인됨)
- 각 슬라이스가 ≥1 acceptance-layer 테스트 보유 ✓ (T-110, T-21x, T-31x, T-410, T-51x, T-60x, T-701)
- billing/integrity AC는 부정 케이스 포함 ✓ (T-103 testUser 우선, T-314 에러 시 invalidate 없음)
- cosmetic AC는 불변식 1개로 제한 ✓ (T-210, T-511, T-701)
- owner 중복 없음: 순수 로직은 unit, seam은 acceptance — 상위 재검증은 wiring을 잡는 T-410/T-211만 ✓

## Non-goals (테스트 없음 — 의도적 부재)

- `?ref=코드` 가입 링크 자동 캡처 — no test
- 타인 프로필 공유 **버튼**(본인만) — no test (OG 메타데이터는 T-60x로 커버)
- 캠페인 관리 / 어드민 UI — no test
- 보상 한도·캠페인 정책 클라 재구현 — no test (서버 신뢰)
- admin 페이지 햅틱 — no test

## TDD 순서 (= writing-plans task 순서)

T-101→T-110 (Slice 1) → T-201/202→T-210~214 (Slice 2) → T-301~303→T-310~315 (Slice 3) →
T-401~405→T-410 (Slice 4) → T-501~503→T-510/511 (Slice 5) → T-601~603 (Slice 6) → T-701 (Slice 7).
각 슬라이스 내부는 unit(순수) 먼저 red→green, 그 위에 acceptance.
