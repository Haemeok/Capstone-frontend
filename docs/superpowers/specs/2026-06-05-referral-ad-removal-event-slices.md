# 친구 초대(광고 제거) 이벤트 — 수직 슬라이스

- 날짜: 2026-06-05
- 브랜치: feature/17
- 상위 설계: `docs/superpowers/specs/2026-06-05-referral-ad-removal-event-design.md`
- 다음 단계: designing-tests-from-requirements (각 슬라이스 AC를 매트릭스 좌측 칸으로)

## Glossary (Ubiquitous Language)

한 개념 = 한 단어. AC·코드 식별자·테스트 이름이 모두 이 단어를 공유한다(추적은 단어 그 자체).

- **캠페인 / campaign**: 활성 추천 이벤트. `campaignKey`(예 `2026-07`), `endsAt`, `maxRewardsPerReferrer`, `referrerRewardedCount`.
- **캠페인 월 라벨 / campaignMonthLabel**: `campaignKey`에서 뽑은 월(예 "7"). 헤더 "{N}월 친구 초대 이벤트".
- **추천인 / referrer**: 코드를 공유해 보상을 받는 사람.
- **추천인 입력 / redeem**: 친구의 코드를 입력하는 행위(평생 1회). 상태 = **RedeemStatus**(`AVAILABLE | ALREADY_REDEEMED | NOT_ELIGIBLE_OLD_USER | REDEEM_WINDOW_EXPIRED | NO_ACTIVE_CAMPAIGN`).
- **내 초대코드 / myReferralCode**: 내가 공유(복사)하는 코드.
- **광고 제거 / showAds·adFreeUntil**: `adStatus.showAds`(광고 표시 여부), `adStatus.adFreeUntil`(만료 시각).
- **선물상자 시트 / referralSheet**: 내 코드 복사 + 친구 코드 입력 + 캠페인 안내가 담긴 반응형 시트.
- **빨간불 / nudge**: 선물상자 재노출 점. `lastOpenedAt` 기준 7일 주기.

## Non-goals (테스트 없음 — 의도적 부재)

- `?ref=코드` 가입 링크 자동 캡처(MVP는 코드 수동 입력만).
- 타인 프로필 공유 버튼(공유 버튼은 본인 프로필에만; OG 메타데이터는 모든 프로필 URL에 적용).
- 캠페인 관리 / 어드민 UI.
- 보상 한도·캠페인 정책의 클라이언트 재구현(서버 `showAds`·RedeemStatus 신뢰).
- admin 페이지 햅틱(WebView 앱 한정 규칙).

---

## Slice 1 — 광고 제거 게이팅 (walking skeleton)

`showAds` 한 값으로 광고 노출 전체 경로를 증명하는 가장 얇은 스레드. `User.adStatus` 타입 확장 +
`AdsGateProvider` 게이트 조건. (이후 모든 보상 슬라이스의 "광고가 사라진다"가 이 게이트로 관찰됨.)

**AC**
- `adStatus.showAds === false`인 사용자에게는 모든 광고 슬롯이 렌더되지 않는다.
- `showAds === true`이거나 `adStatus` 필드가 없는 경우(로그아웃/레거시 응답)에는 기존대로 광고가 노출된다.
- 테스트 유저(`ADSENSE_TEST_USER_IDS`)는 기존대로 광고가 노출되지 않는다(회귀 없음).

## Slice 2 — 선물상자로 내 초대코드 열람·복사

프로필 액션 행 재배치(프로필 수정 bar + 선물상자 + 공유 버튼) + 선물상자 클릭 → 전역 시트 열림 +
내 코드 표시·복사. 이 슬라이스가 `entities/referral`(types·api·queryKeys·`useReferralInfoQuery`),
`sheetStore{isOpen,open,close}`, `ReferralSheetHost`(앱 1회 마운트), 헤더 동적 월 라벨, 서비스 문구를
처음 도입한다(레이어 슬리버는 여기 안에).

**AC**
- 본인 프로필에서 "프로필 수정"은 더 읽기(`CollapsibleP`) 아래 풀폭 직사각형이고, 누르면 `/users/edit`로 이동한다.
- 본인 프로필의 선물상자(블랙톤 Gift 아이콘)를 누르면 반응형 시트가 열린다.
- 시트 헤더에 활성 캠페인의 월이 "{campaignMonthLabel}월 친구 초대 이벤트"로 표시되고, 활성 캠페인이 없으면 "친구 초대 이벤트"로 표시된다.
- 시트에 내 초대코드가 표시되고, "복사"를 누르면 클립보드에 코드가 복사되며 토스트가 뜬다.
- 본인 프로필의 공유 버튼(블랙톤 Share2)을 누르면 프로필 URL(`${BASE_URL}users/{id}`)로 공유가 실행된다.
- (edge) 시트의 추천 정보 조회 중에는 스켈레톤이, 조회 실패 시에는 재시도 가능한 에러 상태가 보인다.

## Slice 3 — 추천인 코드 입력으로 광고 제거 받기

`AVAILABLE` 상태에서 친구 코드 입력·적용(`useRedeemMutation`) → 성공 시 광고 제거 + 만료일. 상태별
비활성과 에러 매핑은 이 슬라이스의 실패/엣지 AC.

**AC**
- `AVAILABLE` 상태면 코드 입력창과 적용 버튼이 활성화된다.
- 유효한 코드를 적용하면 토스트로 `adFreeUntil`(만료일)이 표시되고, `myInfo` 갱신으로 광고가 사라진다.
- 적용 성공 후 상태가 `ALREADY_REDEEMED`(추천인 닉네임·입력일 표시)로 전환된다.
- `ALREADY_REDEEMED` / `NOT_ELIGIBLE_OLD_USER` / `REDEEM_WINDOW_EXPIRED` / `NO_ACTIVE_CAMPAIGN` 상태면 입력이 비활성화되고 해당 상태 문구가 표시된다.
- 코드 없음(1301) / 본인 코드(1302) / 이미 사용(1303) / old user(1304) / 기간 만료(1305) / 캠페인 없음(1306) 응답 시 각 에러 문구가 표시된다.
- 추천인 보상 한도에 도달하면 "친구는 여전히 혜택을 받을 수 있어요" 류 안내 문구가 표시된다.

## Slice 4 — 선물상자 7일 빨간불

활성 캠페인 중 선물상자에 빨간불, 열면 사라지고 7일 뒤 재노출. `open()`에 `lastOpenedAt` 스탬프 추가 +
본인 프로필에서 `useReferralInfoQuery`로 캠페인 활성 판단 + 점 표시.

**AC**
- 활성 캠페인이 있고 선물상자를 연 적이 없으면 빨간불이 보인다.
- 선물상자를 열면 빨간불이 사라진다.
- 마지막으로 연 지 7일이 지나면 빨간불이 다시 보인다(추천인 입력을 마쳤어도 동일).
- 활성 캠페인이 없으면 빨간불이 보이지 않는다.

## Slice 5 — 설정 탭 광고 제거 진입 + 실시간 카운트다운

설정에 광고 제거 행 추가 → 같은 전역 시트 열기 + 활성 시 실시간 카운트다운(`useCountdown`).

**AC**
- 설정에 "광고 제거" 행이 있고, 누르면 선물상자와 동일한 시트가 열린다.
- 광고 제거가 활성(`adFreeUntil` 유효)이면 행에 실시간 카운트다운이 1초마다 갱신되어 표시된다.
- 광고 제거가 비활성이면 "광고 없이 즐기기" 류 라벨이 표시된다.
- (edge) 만료 시각에 도달하면 카운트다운이 0에서 멈춘다.

## Slice 6 — 프로필 공유 링크 OG 메타데이터

`app/users/[userId]/page.tsx`에 `generateMetadata` 추가. 공유된 프로필 링크가 풍부하게 렌더되도록.

**AC**
- 프로필 URL을 공유/미리보기하면 OG 제목에 해당 사용자의 닉네임이 노출된다.
- 소개가 있으면 OG description으로, 없으면 폴백 문구가 노출된다.
- 프로필 이미지가 OG 이미지로, 없으면 기본 이미지 폴백이 노출된다.

## Slice 7 — 추천 보상 알림 매핑

알림 목록에 `REFERRAL_REWARD_GRANTED` 타입의 아이콘/문구 스타일 추가.

**AC**
- `REFERRAL_REWARD_GRANTED` 타입 알림이 목록에 전용 아이콘/스타일로 렌더된다.
- 해당 알림 문구가 백엔드 `message` 그대로 표시된다.

---

## 순서 (writing-plans task 순서)

1. 광고 게이팅(skeleton) → 2. 선물상자·코드 복사 → 3. 추천인 입력 → 4. 빨간불 → 5. 설정 진입·카운트다운 → 6. 프로필 OG → 7. 알림 매핑
