# Lint 에러 청산 (A·B·C 단계) — Design

작성일: 2026-06-04 · 브랜치: feature/17

## 배경

최근 `fbf8d756 chore(tooling): add husky, lint-staged, commitlint and CI lint gates`로
lint가 CI 게이트가 되었다. 현재 `npx eslint src` 기준 위반 223건 = **에러 156 + 경고 67**.

CI는 PR에서 **변경된 `src` 파일만** lint한다 (`git diff ... | xargs npx eslint`, `--max-warnings` 없음).
따라서 CI를 깨는 것은 **건드린 파일의 에러**뿐이고, 안 건드린 파일의 에러는 갚을 부채다.
이 작업은 그 부채(에러)를 카테고리별로 청산한다.

## 범위

대상: **에러 128건** (A·B·C 단계). 경고 67건과 set-state-in-effect는 범위 밖.

### 단계

| 단계 | 규칙 | 건수 | 방식 |
|---|---|---|---|
| **A. Cosmetic** | `react/no-unescaped-entities` 20, `@typescript-eslint/no-require-imports` 4, `@next/next/no-assign-module-variable` 1 | 25 | 대부분 `eslint --fix` 자동수정. `'`→`&apos;` 등 이스케이프, require→import 전환, `module` 변수 리네임 |
| **B. any 청산** | `@typescript-eslint/no-explicit-any` | 85 | 원칙 제대로 타입(unknown+narrowing / 인터페이스 정의). **진짜 외부 경계만** 1줄 사유 코멘트 + `eslint-disable`. 영역별 하위분할 ↓ |
| **C. Compiler 정합성** | `react-hooks/refs` 7, `static-components` 4, `purity` 3, `use-memo` 2, `immutability` 1, `preserve-manual-memoization` 1 | 18 | 케이스별 진짜 수정 (static 컴포넌트 모듈 스코프로 이동, 렌더 중 ref read 제거, useMemo deps 정합) |

**B 하위 분할** (영역별 1 커밋):
- **B1 — `shared/api` 경계**: `client.ts`(10) · `serverApiClient.server.ts`(6) · `types.ts`(3) · auth 테스트·하네스(`_auth-harness.ts` 9 · `auth-contract.test.ts` 6 · `auth.test.ts` 4) → apiClient 제네릭/응답 타입 정립, 테스트 목 타입화
- **B2 — socket 레이어**: `sockjs-websocket.ts`(16) · `sockjs-stomp.d.ts`(4) → STOMP/sockjs 타입 정의. 진짜 라이브러리 경계만 disable
- **B3 — feature/widget/app 산재**: admin 페이지(`grok-batch` 4 · `CurationBlogMode` 4), `TestimonialCarousel`(3), `IngredientSelector`(3), `CalendarTabContent`(3) 등 케이스별

### 범위 밖
- **경고 67건 전부**: `no-img-element`(33) · `no-unused-vars`(15) · `exhaustive-deps`(10) · `incompatible-library`(8) 등. CI 안 막음.
- **`set-state-in-effect`(28)**: 동작-변경 리팩터. 위험도 때문에 **별도 GitHub 이슈**로 분리해 신중히 처리.
- **`no-img-element` config off**: 하드룰(next/image 금지)과 충돌하는 false positive이지만 이번엔 킵.

## Acceptance Criteria

- **AC1**: A·B·C 완료 후 `npx eslint src`에서 대상 규칙(`no-unescaped-entities`, `no-require-imports`, `no-assign-module-variable`, `no-explicit-any`, `react-hooks/{refs,static-components,purity,use-memo,immutability,preserve-manual-memoization}`) 에러 0.
- **AC2**: 남은 `eslint-disable`은 전부 진짜 외부 경계(3rd-party 라이브러리/네트워크)에 한하고, 각 줄에 1줄 사유 코멘트를 동반한다.
- **AC3**: 전 단계 종료 시 `npm run typecheck` green — any 제거 과정에서 새 타입 에러를 만들지 않는다.
- **AC4**: 경고 수(67)는 늘지 않는다 — 에러를 끄려고 `any`로 후퇴하거나 새 경고를 만들지 않는다.
- **AC5**: CI(변경파일 lint + typecheck + build) green.

## Non-goals

- 경고 청산 (별도 작업).
- set-state-in-effect 리팩터 (별도 이슈).
- 동작/UX 변경 — A·B·C는 타입·표현·정합성 한정, 런타임 동작 보존.
- 무관한 리팩터.

## 검증 방식

A·B·C는 기계적이라 새 테스트가 필요 없다. 검증 = `npx eslint src` + `npm run typecheck` green.
B에서 타입을 바꾸는 경우 기존 테스트가 깨지지 않는지로 행동 보존을 확인한다.
