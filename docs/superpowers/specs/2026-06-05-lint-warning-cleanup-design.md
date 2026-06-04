# Lint 경고 청산 — Design

작성일: 2026-06-05 · 브랜치: feature/17 · 선행: `2026-06-04-lint-error-cleanup-design.md`(에러 128건 청산 완료)

## 배경

에러 청산(A·B·C, 128건→0) 후 `npx eslint src` 잔여 = 경고 62 + 에러 25(전부 `set-state-in-effect`, 이슈 #124).
CI는 경고를 막지 않으므로(`--max-warnings` 없음) 이건 **순수 노이즈 정리**다. 목표는 깨끗한 eslint 출력.

## 범위 (경고 62 → 9)

| 슬라이스 | 대상 규칙 | 건수 | 방식 |
|---|---|---|---|
| **W1. no-img config off** | `@next/next/no-img-element` | 33 | `eslint.config.mjs`에서 규칙 `off`. 프로젝트 하드룰(next/image 금지, 순수 `<img>`)의 코드화 |
| **W2. unused-vars 청산** | `@typescript-eslint/no-unused-vars` | 14 | 미사용 import/변수 제거. 의도적 미사용 파라미터/rest는 `_` 프리픽스 |
| **W3. exhaustive-deps 수정** | `react-hooks/exhaustive-deps` | 6 | 케이스별: 누락 deps 추가 또는 의도적 1회 실행이면 사유 disable. **동작 보존 검증** |

### W1 세부
`eslint.config.mjs`의 rules 블록에 `"@next/next/no-img-element": "off"` 추가. 사유(프로젝트는 `next/image` 금지·순수 `<img>` 사용)는 커밋 메세지 본문으로.

### W2 대상 (14)
`QueueStatusCard.tsx:34`, `archetype/[code]/page.tsx:28`, `recipes/[recipeId]/layout.tsx:8`, `recipe/model/types.ts:182`, `archeTypeResult.ts:28`, `useShareImage.ts:163`, `auth.ts:146,172`, `serverApiClient.server.ts:23`, `useFormProgress.ts:18`, `ErrorBoundary.tsx:23`, `SortPicker.tsx:74`, `StoreBadges.tsx:18`.
제거가 안전치 않은 경우(공개 시그니처/타입 멤버)만 `_` 프리픽스. 그 외엔 삭제.

### W3 대상 (6, 동작 민감)
`NotificationItem.tsx:56`, `useRecipeEditForm.ts:82`, `useRecipeRemixForm.ts:71`, `useAICreditPrompt.ts:41`, `useYoutubeExtractionPrompt.ts:42`, `useActiveSection.ts:95`.
각 훅을 읽고 누락 dep가 진짜 stale-closure 버그인지, mount-once 의도인지 판단:
- 진짜 누락 → deps 추가 후 effect가 과도 발화하지 않는지 확인.
- 의도적 1회 실행 → `// eslint-disable-next-line react-hooks/exhaustive-deps -- <사유>`.

## 범위 밖 (의도적 유지 — 테스트 없음)

- `react-hooks/incompatible-library` (8, react-hook-form): React Compiler가 RHF를 최적화 못 한다는 **정보성 통지**. 숨기면 미래에 RHF가 호환돼도 모름 → 키프.
- `react-hooks/unsupported-syntax` (1, `grok-batch/page.tsx:69`): 컴파일러 미지원 구문 통지 → 키프.
- `set-state-in-effect` (25 에러): 이슈 #124.
- no-img를 `next/image`로 전환 ❌ (하드룰 위반).
- 동작/UX 변경 ❌.

## Acceptance Criteria

- **AC-W1.1**: `eslint.config.mjs`에 `no-img-element: off` 추가 후 `npx eslint src`의 `no-img-element` 경고가 0.
- **AC-W2.1**: `no-unused-vars` 경고가 0. `_` 프리픽스는 제거가 안전치 않은 경우로 한정.
- **AC-W3.1**: `react-hooks/exhaustive-deps` 경고가 0. 각 건이 deps 추가 또는 사유 disable로 해소되고, **관찰 가능 동작이 불변**(기존 테스트 + 필요 시 수동 검증).
- **AC-FINAL.1**: `npx eslint src` 경고 = 9 (`incompatible-library` 8 + `unsupported-syntax` 1만 잔존).
- **AC-FINAL.2**: 에러는 여전히 25(`set-state-in-effect`, #124)만. 새 에러 0.
- **AC-FINAL.3**: `npm run typecheck` green.

## 검증 방식

W1·W2는 기계적 — 검증 = `npx eslint src`(해당 규칙 0) + `npm run typecheck`.
W3는 동작-인접 — 기존 테스트 스위트 + 건드린 훅의 동작 보존을 확인(테스트 없는 훅은 수동 검증). 새 테스트는 만들지 않는다(리팩토링 성격).
