# 광고 제거 완전성 — AC & 테스트 설계

- 날짜: 2026-06-05
- 브랜치: feature/17
- 맥락: `adStatus.showAds`(myInfo 응답, 백엔드 추가 예정)로 광고 **스크립트·슬롯·플레이스홀더·예약공간**을 전부 제거. 게이트 메커니즘은 Task 1(`resolveAdsEnabled` + `AdsGateProvider`)에서 이미 구축됨 — 본 작업은 전 표면을 테스트로 잠그고(audit-by-test) 빠진 표면이 있으면 게이트에 연결.

## Glossary
- **showAds**: `adStatus.showAds`. `false` = 광고 제거(ad-free).
- **enabled**: AdsGate 값 = `isAdsEnabled() && !isTestUser && showAds !== false`. 전 광고 표면의 단일 분기.
- **ad surface**: ① AdSense 스크립트 ② 슬롯 DOM ③ dev 플레이스홀더 ④ 하단 앵커 컨테이너 ⑤ 하단 예약 공간(`--main-pb`).
- **test/admin user**: `ADSENSE_TEST_USER_IDS` 계정(기존 admin 광고 제거 로직).

## Acceptance Criteria
- **AC-1 (스크립트):** `showAds === false`면 AdSense 스크립트가 문서에 주입되지 않는다.
- **AC-2 (슬롯):** `showAds === false`면 어떤 슬롯도 DOM을 렌더하지 않는다.
- **AC-3 (플레이스홀더):** `showAds === false`면 dev 플레이스홀더("광고 영역")가 렌더되지 않는다.
- **AC-4 (예약 공간):** `showAds === false`면 `--main-pb`에 하단 앵커 높이가 포함되지 않는다.
- **AC-5 (하단 앵커):** `showAds === false`면 하단 고정 앵커 컨테이너가 렌더되지 않는다.
- **AC-6 (무회귀):** `showAds === true` 또는 `adStatus` 부재 + 광고 설정됨 + 비테스트유저면 광고 표면이 기존대로 렌더된다.
- **AC-7 (admin/test 보존):** 테스트/admin 유저는 `showAds`와 무관하게 광고 표면이 렌더되지 않는다.

## Non-goals
- 백엔드의 `adStatus` 추가(곧 추가 — no test).
- `getMyInfo` 엔드포인트 변경(불필요. adStatus가 현재 myInfo 응답에 실리는 것을 전제).
- 광고 ON 유저의 정상 플레이스홀더/공간 제거.

## Test Matrix (owner 레이어 — 중복 금지)

| AC | 시나리오 | Test ID | 위치 | 상태 |
|----|----|----|----|----|
| 결정 | `resolveAdsEnabled` showAds 분기 | T-101~103 | `shared/adsense/lib/__tests__/resolveAdsEnabled.test.ts` | 기존 |
| AC-2/3 (seam) | showAds=false → `AdSlot` null | T-110 | `app/providers/__tests__/AdsGate.integration.test.tsx` | 기존 |
| AC-2/3/4(slot) | gate=false→null, no-slot+dev→placeholder, slotId→ins, adblock | — | `shared/adsense/__tests__/AdSlot.test.tsx` | 기존 |
| AC-5 | gate=false → `BottomAnchorAdSlot` null | — | `shared/adsense/__tests__/BottomAnchorAdSlot.test.tsx` | 기존 |
| AC-1 | showAds=false → 스크립트 미주입 | **T-A1** | `shared/adsense/__tests__/AdSenseScript.test.tsx` | **신규** |
| AC-6 | showAds=true → 스크립트 주입 | **T-A2** | 〃 | **신규** |
| AC-4 | showAds=false → `--main-pb`에 ad 높이 미포함 | **T-A7** | `widgets/Footer/__tests__/BottomLayoutController.test.tsx` | **신규** |
| AC-4/6 | showAds=true → `--main-pb`에 ad 높이 포함 | **T-A7b** | 〃 | **신규** |
| AC-6 (seam) | showAds=true → `AdSlot`가 ins 렌더 | **T-A8** | `app/providers/__tests__/AdsGate.integration.test.tsx` | **신규(추가)** |
| AC-7 | isTestUser → enabled false | T-103 | resolveAdsEnabled | 기존(재사용) |

**owner 노트:** `enabled`는 `AdsGateProvider`가 한 번 계산(owner=`resolveAdsEnabled`, T-101~103)하고 전 표면이 동일하게 소비. showAds→enabled 도달은 T-110(seam) + 단위로 증명됨 → 표면별 provider 통합 중복 불필요. 얇은 래퍼(Anchor/Home/Youtube/InArticle/InFeed)는 `AdSlot`에 위임 → 별도 테스트 안 함. 갭은 테스트가 전무한 두 표면(스크립트·예약공간)뿐.

## 구현
- 런타임 변경 기대치 없음(게이트가 전 표면을 덮음). 신규 테스트가 통과하면 audit 완료. 빨간색이면 그 표면을 `enabled`에 연결 후 통과시킴.
- billing 표면(스크립트/슬롯/앵커)은 음성 단언(비활성 시 정말 0)을 핵심으로.
