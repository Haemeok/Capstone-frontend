---
name: writing-outline
description: Use when you have an approved thesis (writing-thesis output) and need to commit to a section structure before drafting any prose. Triggers when working doc has a Thesis section but no Outline, when AI tries to draft prose without an outline, or when an article shipped with murky structure because the outline step was skipped.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Writing Outline

> 글쓰기 체인의 두 번째 단계. thesis 가 결정된 working doc 을 받아 글의 *섹션 구조*를 결정한다. 본문 drafting 하지 않음.

## Where this sits

```
writing-thesis  ──▶  writing-outline  ──▶  writing-drafting  ──▶  writing-polish
                     (THIS: structural    (섹션별 사인오프)         (3 패스)
                      pattern + 섹션 트리
                      + 각 섹션 3종 메타
                      + cut list)
```

## Input

`docs/writing/YYYY-MM-DD-<title>.md` working doc 에 `## Thesis` 섹션이 *완성되어 있어야* 한다.

**`## Thesis` 섹션 없으면 STOP.** "Thesis 섹션 없음. `writing-thesis` 먼저" 보고 후 종료. `## Outline` 섹션을 추가하지 않는다.

**working doc 자체가 없으면 STOP.** "working doc 없음. `writing-thesis` 먼저" 보고.

**이미 `## Outline` 있으면** 사용자에게 "이미 outline 있음 — 갱신할까?" 확인. 새로 추가 안 함 (중복 헤더 금지).

## Output

같은 working doc 에 `## Outline` 섹션 append. frontmatter `status: outline` 으로 갱신.

```markdown
## Outline

Structural pattern: <8종 중 1개>

### <H2 섹션 1 제목>
- 목적: <한 줄. 독자가 이 섹션을 읽고 알게 되는 것>
- Emphasis: <없음 | budget #N>
- Evidence: <E1, E3 등 — Thesis 섹션 Evidence pool 의 ID>

### <H2 섹션 2 제목>
- 목적: ...
- Emphasis: 없음
- Evidence: E2

### Cut list
- <안 쓰기로 한 곁가지 1> — <이유 한 줄>
- (또는 비어있으면) (없음)
```

## The Method

### 1. Structural pattern 선택 (필수)

tech-writing 의 Structural Patterns 8종 중 *정확히 1개* 를 선언:

1. **Destination First** — 결과부터, 그 뒤에 어떻게 도달했는지
2. **Failed Approaches as Fuel** — 시도 → 실패 → 다음 시도 → 최종
3. **Mid-Article Pivot** — 문제 자체를 중간에 재정의 (감정적 정점)
4. **Why-Not Table** — 후보 N개 + 각각 탈락 이유 표
5. **Metrics in Pairs** — 모든 수치를 baseline / 비교 / 경쟁 차원과 함께
6. **Natural Language Rule** — 자연어 원칙 → 구현 매핑
7. **Extended Metaphor** — 한 메타포를 섹션 헤더에 일관되게
8. **Anchor Abstractions** — 추상 개념을 구체 장면으로 진입

사용자가 8종 밖 패턴 (예: "STAR 형식") 을 제안하면 silently 채택하지 말 것. "가장 가까운 게 <X>. 이걸로 갈까요, 8종 밖이라도 진행할까요?" 보고.

### 2. 섹션 트리 그리기 (H2 / H3)

structural pattern 에 맞춰 H2 (또는 H3) 섹션을 늘어놓는다. 각 섹션은 글의 한 호흡.

### 3. 각 섹션에 3종 메타 (필수)

모든 섹션 (H2/H3) 직하에 정확히 3줄:

- `목적: <한 줄>` — 독자가 이 섹션을 읽고 알게 되는 것
- `Emphasis: <없음 | budget #N>` — 이 섹션에 Thesis 의 emphasis budget 중 어느 항목이 박히는지. 박힐 거 없으면 "없음" *명시* (줄 생략 금지)
- `Evidence: <E1, E3 등>` — Thesis 의 Evidence pool ID 목록. 안 쓰면 "없음"

### 4. Cut list

`### Cut list` 섹션을 outline 끝에 둔다. 안 쓰기로 한 곁가지 + 이유 한 줄씩. 비어있어도 헤더는 *필수* — 본문에 `(없음)` 명시.

## Sign-off gate

Outline 작성 후 사용자에게 보여주고:

> "Outline 끝. 다음은 `writing-drafting` 으로 섹션별 본문 작성. 진행할까요?"

사인오프 받기 전 다음 스킬 invoke 금지.

## Handoff

사인오프 후 `Skill` 도구로 `writing-drafting` invoke.

## Rationalizations — STOP

| Excuse | Reality |
|---|---|
| "Outline 단계 건너뛰고 drafting 부터" | 본문 들어가면 강조가 outline 없이 산만해진다. 사용자가 호소한 통증이 정확히 이거 |
| "Structural pattern 안 정하고 그냥 쓰면 됨" | 무의식적으로 AI 가 자기 default (TL;DR 박스 + 라벨 bold + 결론 박스) 로 흐름. 8종 중 명시적 선택이 이걸 막음 |
| "Emphasis 줄은 대부분 '없음' 이라 생략" | "없음" 명시 = drafting 단계 강제의 입력. 생략하면 drafting 이 그 섹션에 강조 박아도 알 수 없음 |
| "Cut list 는 안 쓰면 안 적어도" | 빈 cut list 도 "(없음)" 명시. 헤더 자체 부재 = "안 적었나? 빠뜨렸나?" 모호 |
| "사용자가 8종 밖 패턴 요청하면 그대로 따라" | silently 채택하면 글 구조가 흐물해짐. 8종 안에서 가장 가까운 거 제시 후 사용자 확인 받고 진행 |

## Red Flags

- Outline 에 Structural pattern 선언 없음
- 섹션에 3종 메타 중 하나라도 누락
- Emphasis 가 "없음" 대신 줄 자체 생략
- Cut list 헤더 없음
- 사용자 사인오프 전에 `writing-drafting` 호출
