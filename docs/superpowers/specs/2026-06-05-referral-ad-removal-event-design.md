# 친구 초대(광고 제거) 이벤트 — 설계

- 날짜: 2026-06-05
- 브랜치: feature/17
- 백엔드 핸드오프: `docs/referral-event-mvp-frontend-handoff-2026-06-05.html`
- 상태: 승인됨 → vertical-slicing 단계로 전달

## 배경

추천 코드 공유 / 추천인 코드 입력 / 광고 제거 상태 표시를 프론트에 붙인다. 친구를 초대하면
초대한 사람과 초대받은 사람 모두 광고 제거 1개월을 받고, 여러 명 초대 시 혜택이 누적된다(추천인은
캠페인별 최대 3명까지 보상). 백엔드는 아래 3개 API를 제공한다.

| 용도 | API | 판단 기준 |
|---|---|---|
| 광고 표시 여부 | `GET /api/me` | `adStatus.showAds` |
| 마이페이지 추천 상태 | `GET /api/me/referral` | 내 코드 / 캠페인 / 입력 가능 상태 |
| 추천인 코드 입력 | `POST /api/me/referral/redemptions` | 성공 시 `adFreeUntil` |

엔드포인트는 기존 컨벤션(`/dev/me`)에 맞춰 `/dev/me/referral`, `/dev/me/referral/redemptions`로 추가
(base `https://api.recipio.kr/api`). Swagger 갱신 시 그쪽을 source of truth로 재확인.

## 결정 사항 (브레인스토밍)

1. **선물상자 빨간불**: 활성 캠페인 중 7일마다 표시(한 번도 안 열림 OR 마지막으로 연 지 7일 경과).
   열면 사라지고 7일 뒤 재노출. 추천인 입력을 마쳐도 동일(공유로 계속 보상 가능). 활성 캠페인 없으면 미표시.
   — 기존 레시피북 스토어는 seen/unseen **boolean**뿐이라 7일 로직이 없음 → 타임스탬프 기반 스토어를 신규 작성.
2. **설정 행 카운트다운**: 광고 제거 활성 시 **실시간 카운트다운**(D일 HH:MM:SS, 1초 갱신).
3. **이벤트 헤더 월 라벨**: `campaign.campaignKey`(예: `2026-07`)에서 월을 동적 추출. 캠페인 없으면 "친구 초대 이벤트".
4. **내 초대코드 공유**: **코드 복사만**(가입 링크 없음). 친구는 시트에 코드를 직접 입력.
5. **아이콘 톤**: 선물상자는 이모지 아님 — lucide `Gift` 라인 아이콘 블랙톤. 공유는 `Share2` 블랙톤.
   원형 컬러 배지/채도 없음. 빨간불만 작은 점.

## 동의 포인트 (승인됨)

- **광고 게이팅 동작 변화**: `showAds === false` 사용자는 모든 광고 슬롯 미노출(매출 직접 영향). 이벤트 핵심 효과.
- **네트워크 비용**: 본인 프로필 진입 시 캠페인 활성 여부 판단을 위해 `GET /referral` 1회 추가(10분 캐시).

## 아키텍처 (FSD)

의존 방향 `shared → entities → features → widgets → app` 유지.

핵심 제약: 시트를 **두 곳**(프로필 선물상자, 설정 행)에서 열어야 하는데 설정 행은 `features/auth`,
시트는 `features/referral`에 있어 feature↔feature 직접 import는 FSD 위반. 따라서:

- 시트 열림 상태 + 7일 타임스탬프를 zustand 스토어(`entities/referral`)에 둔다.
- 시트 본체(`ReferralSheet`)는 **앱 레이어에서 1회만 마운트**(`ReferralSheetHost`).
- 두 트리거는 스토어 `open()`만 호출 → import 위반 없음, 인스턴스 1개.

## 컴포넌트 / 모듈

### 1. 데이터 레이어

`entities/user/model/types.ts` — `User`에 추가(필드 추가라 non-breaking):
```ts
adStatus?: { showAds: boolean; adFreeUntil: string | null };
```
`/api/me`(`useMyInfoQuery` → `useUserStore`)로 자동 유입.

`entities/referral/model/` (신규):
- `types.ts`: `ReferralCampaign`, `RedeemStatus`(`AVAILABLE | ALREADY_REDEEMED | NOT_ELIGIBLE_OLD_USER | REDEEM_WINDOW_EXPIRED | NO_ACTIVE_CAMPAIGN`), `Referrer`, `ReferralInfo`, `RedeemResult` (discriminated union 우선)
- `api.ts`: `getReferralInfo()` = GET `/dev/me/referral`; `redeemReferralCode(code)` = POST `/dev/me/referral/redemptions`
- `queryKeys.ts`: `REFERRAL_QUERY_KEYS = { all: ['referral'], info: () => [...all, 'info'] }`
- `hooks.ts`: `useReferralInfoQuery`, `useRedeemMutation`(onSuccess → `['referral']` + `['myInfo']` invalidate)
- `lib/derive.ts`: `canRedeem`, `remainingRewardCount`, `referrerRewardLimitReached`, `campaignMonthLabel(campaignKey)`, `normalizeCode`(trim+upper)
- `sheetStore.ts`: zustand — `isOpen`, `lastOpenedAt`(localStorage 영속, 상수 키 모듈), `open()`(열기 + `lastOpenedAt` 갱신 + 영속), `close()`. 레시피북 `unseenImportStore` 형태를 본떠 타임스탬프 버전으로 신규 작성.

### 2. 광고 게이팅

`app/providers/AdsGateProvider.tsx`:
```ts
const showAds = useUserStore((s) => s.user?.adStatus?.showAds);
const enabled = isAdsEnabled() && !isTestUser && showAds !== false;
```
로그아웃/레거시(필드 없음)는 `!== false`로 기존대로 노출. source of truth는 서버 `showAds`
(로컬 `adFreeUntil` 재계산 금지 — 핸드오프 지침).

### 3. 프로필 액션 행 — `widgets/UserProfile/UserProfileDisplay.tsx`

- 닉네임 줄의 작은 연필 버튼 **제거**.
- `CollapsibleP`(더 읽기) **아래**, 본인 프로필 한정 액션 행:
  ```
  [   프로필 수정  (flex-1 긴 직사각형)   ] [ Gift ] [ Share2 ]
  ```
  - 프로필 수정: 풀폭 직사각형 링크 → `/users/edit`. `UserInfoEditButton`에 `variant: "icon" | "bar"` 추가(기본 icon 유지).
  - Gift 버튼: `ReferralGiftButton`(features/referral) — 블랙톤 라인 아이콘 + 빨간불 + `open()` + 햅틱 Light.
  - Share2 버튼: `useShare({ url: ${BASE_URL}users/${user.id} })` 프로필 공유, `aria-label`, 햅틱 Light, 블랙톤.
- 타인 프로필: 기존 `ActionButton`(팔로우 등) 유지. 편집/선물상자 없음.

### 4. 프로필 공유 메타데이터 — `app/users/[userId]/page.tsx`

`generateMetadata` 신규 추가. 서버 안전 fetch(레시피 페이지 패턴)로 공개 유저 조회 후:
- `title`=닉네임, `description`=소개(없으면 폴백)
- `openGraph`: title/description, `url`=`${BASE_URL}users/{id}`, `images`=[profileImage]
- Twitter 카드. 이미지/소개 없을 때 폴백.

### 5. ReferralSheet — `features/referral/ui/ReferralSheet.tsx`

`useResponsiveSheet`(모바일 Drawer / 데스크톱 Dialog), controlled. 열릴 때 `useReferralInfoQuery`.

- 헤더: `{campaignMonthLabel}월 친구 초대 이벤트` (동적, 캠페인 없으면 "친구 초대 이벤트").
- 서비스 문구(오늘의집 톤): "친구를 초대하면 두 분 모두 한 달 동안 광고 없이 레시피오를 즐길 수 있어요.
  여러 친구를 초대할수록 혜택이 쌓여요."
- 내 초대코드: 큰 코드 표기 + **복사** 버튼(클립보드 + 토스트 + 햅틱 Success). 코드만 복사.
- 친구 코드 입력(상태별):
  - `AVAILABLE`: input(제출 시 `normalizeCode`) + 적용 → `useRedeemMutation`. 성공 시 토스트 + `adFreeUntil`
    날짜 표시, `myInfo`/`referral` 갱신 → 상태가 `ALREADY_REDEEMED`로 전환.
  - `ALREADY_REDEEMED`: 추천인 닉네임 + 입력일 표시, 비활성 "이미 추천인을 입력했어요".
  - `NOT_ELIGIBLE_OLD_USER` / `REDEEM_WINDOW_EXPIRED` / `NO_ACTIVE_CAMPAIGN`: 비활성 + 상태 문구.
- 안내: "추천인 코드는 가입 후 30일 이내, 한 번만 입력할 수 있습니다." + 보상 한도 도달 시 안내 문구.
- 에러 매핑: 1301(코드 없음) / 1302(본인 코드) / 1303(이미 사용) / 1304(old user) / 1305(기간 만료) /
  1306(캠페인 없음) → 사용자 문구.
- 보상 진행률(선택): "이번 이벤트 보상 {referrerRewardedCount}/{maxRewardsPerReferrer}".

### 6. ReferralGiftButton — `features/referral/ui/ReferralGiftButton.tsx`

블랙톤 `Gift` 라인 아이콘 버튼. 빨간불 = `캠페인 활성 && (lastOpenedAt 없음 || now - lastOpenedAt > 7일)`.
캠페인 활성 여부 판단을 위해 본인 프로필 진입 시 `useReferralInfoQuery` 활성(GET 1회, 10분 캐시).
클릭 → `sheetStore.open()`(=`lastOpenedAt` 갱신) + 햅틱 Light.

### 7. 설정 행 — `features/auth/ui/SettingsActionButton.tsx`

행 markup 인라인 작성(features → entities 허용). 클릭 → `useReferralSheetStore.open()`. 블랙톤 `Gift` 아이콘
(원형 컬러 배지/Sparkles 금지).
- 광고 제거 활성(`adFreeUntil` 유효 / `showAds === false`): 실시간 카운트다운 "광고 제거 · D일 HH:MM:SS".
- 비활성: "광고 없이 즐기기" 류 라벨.
- `shared/lib/hooks/useCountdown.ts`(신규): `setInterval` 1초, 언마운트 정리, 0에서 정지(외부 시스템 동기화 effect).

### 8. 알림 매핑

`REFERRAL_REWARD_GRANTED` 타입 → 알림 목록에 아이콘/문구 스타일 매핑 추가(작은 작업).

### 9. 전역 호스트

`features/referral/ui/ReferralSheetHost.tsx` → 앱 레이아웃/프로바이더에 1회 마운트, `sheetStore` ↔
`ReferralSheet` 바인딩.

## 데이터 흐름

1. 앱 로드 → `useMyInfoQuery`가 `/api/me`(adStatus 포함) → `useUserStore` → `AdsGateProvider`가 광고 분기.
2. 본인 프로필 진입 → `useReferralInfoQuery`(GET /referral) → 선물상자 빨간불 계산.
3. 선물상자/설정 행 클릭 → `sheetStore.open()` → 전역 `ReferralSheet` 표시.
4. 친구 코드 적용 → `useRedeemMutation`(POST) → 성공 → `['myInfo']`+`['referral']` invalidate →
   `showAds`/`adFreeUntil` 갱신 → 광고 사라짐 + 설정 카운트다운 시작.

## 에러 / 엣지 처리

- 추천인 탈퇴: `ALREADY_REDEEMED` + `referrer.nickname`("탈퇴한 사용자") 그대로 표시.
- 캠페인 설정 충돌(1308) / 코드 생성 실패(1309): 일반 오류 토스트.
- 시트 열렸는데 `referral` 로딩/에러: 로딩 스켈레톤 / 재시도 가능한 에러 상태.
- 카운트다운 만료 도달: 0에서 정지, 다음 `myInfo` 갱신 시 `showAds` 복구로 광고 재노출.

## Acceptance Criteria

- `/api/me`의 `adStatus.showAds === false`이면 모든 광고 슬롯이 렌더되지 않는다.
- 본인 프로필에서 "프로필 수정"은 더 읽기 아래 풀폭 직사각형이고 누르면 `/users/edit`로 이동한다.
- 활성 캠페인이 있고 선물상자를 7일 내 연 적이 없으면 빨간불이 보이고, 열면 사라지며, 7일 뒤 다시 보인다
  (추천인 입력을 마쳤어도 동일).
- 활성 캠페인이 없으면 빨간불이 보이지 않는다.
- 선물상자/설정 행 어느 쪽을 눌러도 동일한 시트가 열린다.
- 시트에서 내 코드 "복사"를 누르면 클립보드에 코드가 복사되고 토스트가 뜬다.
- `AVAILABLE` 상태에서 유효한 친구 코드 적용 시 토스트로 `adFreeUntil`이 표시되고 광고가 사라진다.
- `ALREADY_REDEEMED` / old user / 기간 만료 / 캠페인 없음 상태에선 입력이 비활성화되고 해당 문구가 보인다.
- 잘못된 코드 / 본인 코드 / 이미 사용 시 각 에러 문구가 뜬다.
- 광고 제거가 활성이면 설정 행에 실시간 카운트다운이 1초마다 갱신된다.
- 헤더의 월 라벨이 활성 캠페인의 `campaignKey`에서 동적으로 표기된다.
- 타인 프로필 페이지를 공유하면 OG에 그 사용자의 닉네임·소개·프로필 이미지가 노출된다.

## Non-goals

- `?ref=코드` 가입 링크 자동 캡처(MVP는 코드 수동 입력만).
- 타인 프로필 공유 버튼(본인 프로필만).
- 캠페인 관리 / 어드민 UI.
- 보상 한도 / 캠페인 정책의 클라이언트 재구현(서버 `showAds` / 상태값 신뢰).
- admin 페이지 햅틱(WebView 앱 한정 규칙).

## Glossary

- **캠페인(campaign)**: 활성 추천 이벤트. `campaignKey`(예 `2026-07`), `endsAt`, `maxRewardsPerReferrer`, `referrerRewardedCount`.
- **추천인(referrer)**: 코드를 공유해 보상을 받는 사람. 초대받은 사람이 추천인 코드를 입력.
- **추천인 입력 / redeem**: 친구의 코드를 입력하는 행위. 평생 1회. 상태값 = `RedeemStatus`.
- **광고 제거(ad-free) / showAds**: `adStatus.showAds`(광고 표시 여부) / `adFreeUntil`(만료 시각).
- **빨간불 / nudge**: 선물상자 재노출 점. `lastOpenedAt` 기준 7일 주기.
- **내 초대코드 / myReferralCode**: 내가 공유하는 코드(복사 대상).
