# Lint 경고 청산 — Vertical Slices

작성일: 2026-06-05 · 브랜치: feature/17 · spec: `2026-06-05-lint-warning-cleanup-design.md`

## 성격 명시

기계적 청산(에러 청산과 동일 성격). 사용자 관찰 가능 행동 없음, 핵심 비목표는 **동작 보존**.
데모 대상(product owner) = CI 게이트/리뷰어. 슬라이스 산출 = "이 규칙이 0 + tsc green + 기존 테스트 통과".
절단축 = **규칙×성격**(레이어 아님). 테스트는 생략(리팩토링) — linter가 red→green 오라클, 추적은 AC 단어.

## Glossary

| 단어 | 뜻 |
|---|---|
| **target rule** | 0으로 모는 대상 eslint 규칙 |
| **clean** | `npx eslint src`가 그 규칙에 대해 경고 0 |
| **reasoned disable** | `eslint-disable` + 1줄 사유 코멘트 (의도적 케이스만) |
| **behavior preserved** | 기존 테스트 통과 + 런타임 출력 불변 |

## Non-goals (테스트 없음 — 의도적 부재)

- `react-hooks/incompatible-library` (8, react-hook-form) — 컴파일러 정보성 통지, 키프.
- `react-hooks/unsupported-syntax` (1) — 키프.
- `set-state-in-effect` (25 에러) — 이슈 #124.
- no-img → `next/image` 전환 ❌ (하드룰 위반).
- 동작/UX 변경 ❌.

## 슬라이스 (순서 = 계획 task 순서)

### W1 (walking skeleton). no-img-element config off
**target rule**: `@next/next/no-img-element` (33)
**방식**: `eslint.config.mjs` rules에 `"@next/next/no-img-element": "off"`. 하드룰(next/image 금지·순수 `<img>`)의 코드화. 가장 얇은 1줄 변경으로 루프 증명.

- **AC-W1.1**: 설정 추가 후 `npx eslint src`의 `no-img-element` 경고가 0.
- **AC-W1.2**: 다른 규칙 카운트는 불변(이 변경이 다른 경고/에러를 늘리지 않는다).

### W2. unused-vars 청산
**target rule**: `@typescript-eslint/no-unused-vars` (14)
**영역**: `QueueStatusCard:34`, `archetype/[code]/page:28`, `recipes/[recipeId]/layout:8`, `recipe/model/types:182`, `archeTypeResult:28`, `useShareImage:163`, `auth:146,172`, `serverApiClient.server:23`, `useFormProgress:18`, `ErrorBoundary:23`, `SortPicker:74`, `StoreBadges:18`.

- **AC-W2.1**: `no-unused-vars` 경고가 0.
- **AC-W2.2**: 제거는 미사용 import/변수 삭제로. 제거가 안전치 않은 경우(공개 시그니처·타입 멤버)만 `_` 프리픽스 (**reasoned**).
- **AC-W2.3**: `npm run typecheck` green (삭제로 깨진 참조 없음).

### W3. exhaustive-deps 수정 (동작 민감)
**target rule**: `react-hooks/exhaustive-deps` (6)
**영역**: `NotificationItem:56`, `useRecipeEditForm:82`, `useRecipeRemixForm:71`, `useAICreditPrompt:41`, `useYoutubeExtractionPrompt:42`, `useActiveSection:95`.

- **AC-W3.1**: `react-hooks/exhaustive-deps` 경고가 0.
- **AC-W3.2**: 각 건은 누락 deps 추가(진짜 stale-closure) 또는 **reasoned disable**(의도적 1회 실행)로 해소.
- **AC-W3.3**: 관찰 가능 동작 불변 (behavior preserved — 기존 테스트 + 테스트 없는 훅은 수동 검증). deps 추가가 effect 과도 발화를 일으키지 않는다.

### 전체 종료 게이트
- **AC-FINAL.1**: `npx eslint src` 경고 = 9 (`incompatible-library` 8 + `unsupported-syntax` 1만 잔존).
- **AC-FINAL.2**: 에러는 25(`set-state-in-effect`, #124)만, 새 에러 0.
- **AC-FINAL.3**: `npm run typecheck` green.

## 검증 전략

W1·W2 기계적 → `npx eslint src` + `npm run typecheck`.
W3 동작-인접 → 기존 테스트 + 건드린 훅 동작 보존 확인(테스트 없으면 수동). 새 테스트 없음.
