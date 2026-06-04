# Lint 에러 청산 — Vertical Slices

작성일: 2026-06-04 · 브랜치: feature/17 · spec: `2026-06-04-lint-error-cleanup-design.md`

## 성격 명시 (정직하게)

이건 기능이 아니라 기계적 청산이다. 따라서 "사용자 관찰 가능 행동"은 없고,
오히려 **런타임 동작 보존**이 핵심 비목표다. 여기서 데모 대상(product owner)은
**CI 게이트/리뷰어**이며, 슬라이스의 관찰 가능한 산출은:

> "이 **규칙군**이 이 **영역**에서 에러 0 + `tsc` green + 기존 테스트 통과(동작 보존)"

절단축은 레이어(types→api→ui)가 아니라 **규칙 × 영역**이다. 이게 이 작업의
올바른 수직 절단이고, "타입 전부 먼저 → disable 전부 나중"이 수평(금지) 절단이다.

## Glossary (Ubiquitous Language)

| 단어 | 뜻 |
|---|---|
| **target rule** | 0으로 모는 대상 eslint 규칙 (예: `no-explicit-any`) |
| **clean** | `npx eslint src`가 해당 슬라이스의 target rule에 대해 에러 0 |
| **boundary disable** | 진짜 3rd-party/네트워크 경계에만 두는 `eslint-disable` + 1줄 사유 코멘트 |
| **behavior preserved** | 기존 테스트 + `npm run build` 통과, 런타임 출력 불변 |
| **typed** | `any` 제거를 `unknown`+narrowing 또는 인터페이스 정의로 달성 (disable 아님) |

코드 식별자·테스트 이름·AC는 위 단어를 그대로 쓴다.

## Non-goals (테스트 없음 — 의도적 부재)

- **경고 67건 전부**: `no-img-element`(33) · `no-unused-vars`(15) · `exhaustive-deps`(10) · `incompatible-library`(8).
- **`set-state-in-effect`(28)**: 이슈 #124로 분리.
- **`no-img-element` config off**: 이번엔 킵.
- **런타임 동작/UX 변경**: 모든 슬라이스는 타입·표현·정합성 한정.
- **무관한 리팩터.**

## 슬라이스 (순서 = writing-plans task 순서)

### S0 (walking skeleton). Cosmetic clean — 루프 증명용 가장 얇은 실
**target rule**: `react/no-unescaped-entities`(20) · `@typescript-eslint/no-require-imports`(4) · `@next/next/no-assign-module-variable`(1)
**방식**: 대부분 `eslint --fix`, require→import 전환, `module` 변수 리네임.
가장 위험 낮은 영역으로 "고침→clean→tsc green→테스트 통과→커밋" 루프를 먼저 증명.

- **AC-S0.1**: `npx eslint src` 결과 위 3개 target rule 에러가 0이다.
- **AC-S0.2**: `npm run typecheck` green.
- **AC-S0.3**: 기존 테스트 스위트가 그대로 통과한다 (behavior preserved).

### S1. shared/api any clean
**target rule**: `@typescript-eslint/no-explicit-any` (shared/api 영역)
**영역**: `client.ts`(10) · `serverApiClient.server.ts`(6) · `types.ts`(3) · auth 테스트·하네스(`_auth-harness.ts` 9 · `auth-contract.test.ts` 6 · `auth.test.ts` 4).

- **AC-S1.1**: shared/api 영역 파일에서 `no-explicit-any` 에러가 0이다.
- **AC-S1.2**: 제거는 **typed**로 달성한다. 남는 건 **boundary disable**뿐이며 각 줄에 1줄 사유가 붙는다.
- **AC-S1.3**: auth 관련 기존 테스트(contract/auth)가 그대로 통과한다 (behavior preserved).
- **AC-S1.4**: `npm run typecheck` green.

### S2. socket 레이어 any clean
**target rule**: `@typescript-eslint/no-explicit-any` (socket 영역)
**영역**: `sockjs-websocket.ts`(16) · `sockjs-stomp.d.ts`(4).

- **AC-S2.1**: socket 영역 파일에서 `no-explicit-any` 에러가 0이다.
- **AC-S2.2**: STOMP/sockjs 타입 정의로 **typed**. 진짜 라이브러리 경계만 **boundary disable**(1줄 사유).
- **AC-S2.3**: `npm run typecheck` green.

### S3. 산재 any clean (feature/widget/app)
**target rule**: `@typescript-eslint/no-explicit-any` (나머지 영역)
**영역**: admin(`grok-batch` 4 · `CurationBlogMode` 4) · `TestimonialCarousel`(3) · `IngredientSelector`(3) · `CalendarTabContent`(3) 등 잔여 전부.

- **AC-S3.1**: src 전체에서 `no-explicit-any` 에러가 0이다 (S1·S2 포함 누적 결과).
- **AC-S3.2**: 제거는 **typed**, 남는 건 **boundary disable**(1줄 사유)뿐.
- **AC-S3.3**: `npm run typecheck` green, 기존 테스트 통과.

### S4. React Compiler 정합성 clean
**target rule**: `react-hooks/refs`(7) · `static-components`(4) · `purity`(3) · `use-memo`(2) · `immutability`(1) · `preserve-manual-memoization`(1)
**방식**: 케이스별 진짜 수정 — static 컴포넌트 모듈 스코프로 이동, 렌더 중 ref read 제거, useMemo deps 정합 맞추기. (set-state-in-effect는 여기 포함 안 됨 — #124)

- **AC-S4.1**: 위 6개 target rule의 에러가 src에서 0이다.
- **AC-S4.2**: 수정 대상 컴포넌트의 관찰 가능 동작이 변경 전과 동일하다 (behavior preserved — 기존 테스트 + build로 확인).
- **AC-S4.3**: `npm run typecheck` green.

### 전체 종료 게이트
- **AC-FINAL.1**: `npx eslint src` 에러 0 (단, 범위 밖 `set-state-in-effect` 28건은 #124로 잔존 허용 — 이 28건 외 에러 0).
- **AC-FINAL.2**: 경고 수(67)가 늘지 않는다.
- **AC-FINAL.3**: CI(변경파일 lint + typecheck + build) green.

## 검증 전략 메모

S0~S4는 기계적이라 **새 테스트를 만들지 않는다**. 검증 = `npx eslint src`(규칙별 0) +
`npm run typecheck` + 기존 테스트 스위트(behavior preserved guard) + `npm run build`.
타입을 바꾸는 S1~S3에서 기존 테스트가 깨지면 그게 동작 회귀 신호다.
designing-tests 단계는 "새 테스트 작성"이 아니라 "이 슬라이스의 behavior-preserved를
무엇이 보증하는가(어느 기존 테스트/도구)"를 매핑하는 것으로 갈음한다.
