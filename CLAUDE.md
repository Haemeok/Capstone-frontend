# CLAUDE.md

이 프로젝트는 **Next.js 15 (App Router) + TypeScript + Feature-Sliced Design**. Web과 React Native WebView 앱(iOS/Android)이 같은 코드베이스 공유.

라이브러리/API 문서가 필요하면 **Context7 MCP**를 먼저 쓸 것 (사용자가 묻지 않아도).

**백엔드 API 계약**(엔드포인트·DTO 필드명·enum·에러코드)은 추정 금지, OpenAPI로 검증: `https://api.recipio.kr/v3/api-docs` (JSON, 에이전트가 직접 fetch/grep) · swagger-ui `https://api.recipio.kr/swagger-ui/index.html`. 상세·조회 스니펫은 `docs/guides/api-and-realtime.md`.

---

## 코드 작성 자가체크 (always-on)

매 코드 작성·수정·리뷰 시 **`code-quality` 스킬**의 자가체크가 always-on으로 적용된다
(Size / FSD 위치 / human-error blocker / Next.js 캐시 / React Compiler / TS / Naming /
A11y / Testing / 주석금지). 룰 위반·불확실·위반 직전이면 해당
`.claude/skills/code-quality/rules/<prefix>-*.md`를 Read.

## 작업별 가이드 (Lookup Table)

매 세션마다 모든 가이드를 컨텍스트에 끌고 다니지 말 것. **해당 작업 시작 직전에 Read**.

| 작업                   | 참고 문서                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------ |
| UI/디자인 작업         | `docs/guides/design.md` (오늘의집 톤). 톤 이미지: `docs/design/`                     |
| 리팩터·코드 품질 리뷰  | `docs/guides/code-style.md` (Readability/Predictability/Cohesion/Coupling 패턴 모음) |
| API · 인증 · WebSocket | `docs/guides/api-and-realtime.md`                                                    |
| Haptic Feedback 상세   | `.claude/skills/haptic-feedback/SKILL.md` (skill로 자동 호출)                        |

**글쓰기 워크플로 (always-on):** 기술 블로그 글 *설계*가 필요한 시점 (refactor 끝나고 글 쓸 차례, "이거 글로 쓰자" 류) 에는 `writing-thesis → writing-outline → writing-drafting → writing-polish` 체인 사용. 각 단계 사인오프 게이트. velog 호출은 사용자 몫 (별도). 정적 검증은 `bash scripts/check-writing-harness.sh`.

**UI 작업 절대 금지 (다시 묻지 말 것):**

- ❌ Sparkles 등 라인 아이콘 + 원형 배경 배지 (`rounded-full bg-{color}/10` 패턴)
- ❌ border-2 컬러 강조, 진한 그라디언트, 채도 높은 원색
- ❌ 마케팅 카피("✨ 마법처럼", "AI가 답합니다!")

---

## Critical Rules

### NEVER ASK QUESTIONS

- `npm run dev` 실행 여부 묻지 말 것 — 코드 완성 후 그냥 진행
- 작업 끝나고 "추가 작업할까요?" 류 확인 금지

### Build vs Type Check (Windows)

- 코드 변경 후엔 **`npx tsc --noEmit`** (타입 체크만)
- `npm run build` 는 **사용자가 명시적으로 요청할 때만**. 실행 전:
  1. localhost 확인: `netstat -ano | findstr :3000`
  2. 떠있으면 종료: `taskkill //PID <pid> //F` (bash에선 `cmd //c taskkill ...` 래핑 필요)
  3. build 후 `npm run dev` 백그라운드로 복구

### Route / ID 규약

모든 리소스 ID는 **문자열(nanoid/uuid)**, 숫자 아님.

- 경로 정규식 `\d+` 금지 → `[^/]+` 사용
- `[^/]+` 사용 시 `new`, `my-fridge`, `admin`, `category` 같은 예약 세그먼트와 충돌 방지를 위해 negative lookahead로 제외

### Plan / Task / Commit 분할 (anti-fragmentation)

**한 commit = 한 의미 단위**. 50줄짜리 컴포넌트 5개를 5 commit으로 쪼개지 말 것.

- **묶어라**: 같은 PR · 같은 테마의 신규 presentational 컴포넌트들, 같은 영역의 시각 변경(색·아이콘·클래스)
- **나눠라**: 레이어가 다른 변경(타입 ↔ 파서 ↔ API ↔ 와이어업), TDD가 정당한 진짜 로직, bisect가 필요한 critical change
- subagent ceremony 비용 인식: 8개 신규 컴포넌트를 8 task로 만든 건 plan 실패

### PR 본문 ↔ 활성 이슈 연결 (always-on)

PR 본문을 작성할 때 `.claude/state/active-issue` 파일을 먼저 읽는다.

- 파일이 존재하고 비어있지 않으면 각 줄의 이슈 번호를 PR 본문 끝에 `Closes #N` 줄들로 자동 삽입한다.
- `gh pr create` 성공 후 해당 파일을 truncate한다 (`: > .claude/state/active-issue`).
- 파일이 없거나 비어있으면 한 줄 경고(`"활성 이슈 없음 — Closes 없이 진행"`)만 출력하고 그대로 진행한다.

이 규칙은 `/commit-push-pr` slash command / 자연어 "PR 만들자" / 그 외 모든 PR 생성 경로에 적용된다.

### Superpowers 워크플로 종료 → compounding-lessons 필수

- `finishing-a-development-branch`의 어떤 옵션(merge/PR/keep/discard)이든 마지막에 `compounding-lessons` invoke
- `subagent-driven-development`, `executing-plans`의 마지막 task 직후도 동일
- "딱히 컴파운드할 게 없어 보임" 자체 판단 금지. 메타 스킬이 "nothing to compound"라고 자가보고하게 둘 것
- 프로젝트 로컬 `finishing-a-development-branch` (`.claude/skills/...`)가 plugin 버전을 override

### 요구사항 분해→테스트 설계 단계 (always-on)

체인: `brainstorming` → `vertical-slicing` → `designing-tests-from-requirements` →
`writing-plans` (각 단계 상세·트리거는 해당 스킬 description). 핵심: 기능을 레이어가
아닌 **행동(수직 슬라이스)**으로 잘라야 test=행동이 된다.

- 프로젝트 로컬 4개 스킬(`.claude/skills/...`)이 plugin 버전을 override (brainstorming
  종착점을 vertical-slicing으로 reroute, writing-plans에 매트릭스 게이트 추가). plugin
  업데이트 시 reroute/게이트만 유지하며 refresh.
- 서브에이전트는 프로젝트 스킬을 안정 상속 못 받으니, plan/분해/test 위임 시 prompt에
  "task는 수직 슬라이스로 분해, 각 슬라이스 AC 작성, AC→테스트는 글로서리 단어로 추적,
  writing-plans 전 매트릭스 필수" 한 줄 주입.

---

## Architecture

### Feature-Sliced Design (엄격)

의존 방향: `shared → entities → features → widgets → app`

- 역방향 import 금지
- 같은 레이어 내 cross-import 금지
- 레이어 위반은 PR 자동 거부 사유

### Component Patterns

- 화살표 함수 + `const` 선언
- 타입은 `type`. `interface` 금지
- 서버 컴포넌트(SEO/초기 데이터) ↔ `"use client"` (인터랙션) 명확히 분리
- Drawer/Modal은 controlled (`isOpen`, `onOpenChange` props)
- 단일 책임 원칙. 조건부 렌더가 복잡하면 별 컴포넌트로 분리. prop drilling 3단 초과면 composition/Context

### State / Data Fetching

- 서버: Next.js 내장 `fetch` (SSR/SSG)
- 클라이언트: `apiClient` (자동 401 처리 + 토큰 리프레시)
- 서버 상태: TanStack Query (5분 stale, 30분 GC)
- 클라이언트 상태: Zustand
- Hydration: TanStack Query `initialData`로 서버↔클라이언트 동기화

### 핵심 라이브러리

- UI: Radix UI + Tailwind
- Form: React Hook Form
- Animation: Framer Motion / GSAP
- 컬러 토큰: `olive-light`, `olive-dark`, `beige`, `brown` (Tailwind config)
- 텍스트 컬러: `ink`(#222) / `ink-sub`(#505050) / `ink-muted`(#767676, 4.5:1 마지노선) / `ink-disabled`(비활성 전용) 4단계만. `text-gray-*`·`text-dark`·`text-black` 신규 사용 금지

---

## Project Conventions

### 이미지

**`next/image` 절대 금지** (사용자 메모리). LCP 이미지는 순수 `<img>`. 그 외엔 `@/shared/ui/image/Image`.

### Haptic

모든 인터랙티브 요소에 `triggerHaptic()` (`@/shared/lib/bridge`). 스타일 선택·상세는
`haptic-feedback` skill (자동 호출).

### Web + RN WebView

- 같은 Next.js 코드베이스. 네이티브 기능은 WebView bridge 경유
- 이건 PWA 아님

### File Organization

- 도메인/feature 단위로 묶기 (FSD 슬라이스 내부 구조 따라가기)
- barrel export (`index.ts`)로 깔끔한 import
- 상수는 관련 로직 옆에 두거나 명확한 네이밍

### Commit / Tone

- 커밋: 영문 conventional commit + 본문. 관련 hunk만 묶고 필요시 부분 staging
- 응답 톤: "코드 들어갑니다", "안 알려주시면 그대로 갑니다" 같은 통보·ultimatum 금지. 부드러운 협업 어투
