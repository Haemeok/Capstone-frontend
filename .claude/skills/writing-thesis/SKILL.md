---
name: writing-thesis
description: Use when starting a technical blog article from already-gathered context (refactor notes, specs, git log, code) — before any outline or drafting. Triggers when the user says "기술 블로그 쓰자" with raw material, when AI tries to dive into drafting without committing to a single thesis, or when a previous article shipped with scattered emphasis because no thesis was nailed first.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Writing Thesis

> 글쓰기 4단계 체인의 첫 단계. 손에 있는 컨텍스트(specs / refactor 노트 / git log / 코드)를 받아 한 글의 *thesis 결정*만 한다. drafting 하지 않음.

## Where this sits

```
writing-thesis  ──▶  writing-outline  ──▶  writing-drafting  ──▶  writing-polish
(THIS: reader +      (섹션 트리)            (섹션별 사인오프)         (3 패스)
 thesis +
 emphasis budget +
 evidence pool +
 non-goals)
```

## Input

사용자가 dump 한 컨텍스트 — specs / refactor 노트 / git log / 코드 / 회의 메모. 가공 안 된 raw 도 OK.

**dump 가 비어있으면 STOP.** 자동으로 `Glob` / `Grep` 으로 specs / git 을 뒤지지 말 것. 사용자에게 두 옵션 제시:

- (A) "원하시면 제가 specs/git 을 자동 검색해서 dump 만들어 드릴까요?"
- (B) "또는 raw 컨텍스트를 직접 붙여주세요."

사용자가 (A) 선택했을 때만 자동 검색 실행. 묻지 않고 silently 검색하는 거 금지.

## Output

`docs/writing/YYYY-MM-DD-<title>.md` 의 frontmatter + `## Thesis` 섹션을 작성한다.

```markdown
---
title: <글 제목>
status: thesis
---

## Thesis

- **Reader:** <페르소나 + 사전지식 수준 한 줄. 예: "Next.js App Router 알지만 Cache Components 안 써본 시니어 프론트">
- **One-sentence thesis:** <"이 글을 읽고 독자가 X 하나만 가져가면 성공" 한 문장>
- **Emphasis budget (3):**
  1. <강조 포인트 1>
  2. <강조 포인트 2>
  3. <강조 포인트 3>
- **Evidence pool:**
  - E1. <사용 가능한 사실 1 — 코드 스니펫 / 수치 / 인용 / 결정 이유>
  - E2. ...
- **Non-goals:**
  - <일부러 안 다루는 곁가지 1>
  - ...
```

## The Method

### 1. Reader 결정

독자 한 명을 페르소나 + 사전지식 수준으로 정한다. "모두" 는 reader 가 아니다 — 글이 군더더기로 흐른다.

### 2. One-sentence thesis 추출

사용자 dump 에서 핵심 메시지 한 줄을 뽑는다. 검증:

- 한 문장에 우겨넣어지는가? 두 메시지가 한 문장에 안 들어가면 **글이 두 개**다. 사용자에게 "두 글입니다 — (A) ... (B) ... 어느 쪽?" 보고 후 사용자 선택 받기 전 진행 금지
- thesis 가 의견인가? "X 를 Y 로 바꿨더니 Z 결과" 는 thesis. "X 에 대한 소개" 는 thesis 가 아니다 (관점 없음)

### 3. Emphasis budget 산출

글 전체에서 *진짜* 강조할 포인트 N개 (기본 3). 이 N개 밖에는 본문에서 bold / heading 위계 부여 금지 — drafting / polish 단계가 강제한다. "이상한 곳 강조" 를 막는 핵심 메커니즘.

### 4. Evidence pool 추출

dump 에서 본문에 쓸 수 있는 사실 / 수치 / 인용 / 결정 이유를 ID (E1, E2, ...) 붙여 나열. drafting 단계에서 pool 외 사실은 본문에 못 들어가고 `?? — 사용자 확인 필요` 마커를 단다. hallucination 차단.

### 5. Non-goals 명시

글이 일부러 안 다루는 곁가지를 1~5개. silently 끼어드는 거 차단.

## Sign-off gate

5개 필드 모두 채워졌으면 사용자에게 Thesis 섹션 전체를 보여주고 묻는다:

> "Thesis 결정 끝. 다음은 `writing-outline` 으로 섹션 구조 잡습니다. 진행할까요?"

사용자 사인오프 ("ok" / "다음" / "ㅇ" / "yes" 등 명시적 긍정) 없으면 다음 스킬 invoke 금지. 침묵은 사인오프 아님.

## Handoff

사인오프 받으면 `Skill` 도구로 `writing-outline` invoke. working doc 경로를 다음 스킬에 전달.

## Rationalizations — STOP

| Excuse | Reality |
|---|---|
| "dump 가 풍부하니 thesis 단계 건너뛰고 outline 부터" | 풍부한 dump 가 thesis 모호를 가린다. "이 글의 핵심 한 문장" 을 안 박으면 drafting 단계에서 강조가 산만해진다 |
| "두 메시지 한 글에 같이 가도 됨, 분량 충분" | 한 글 = 한 thesis 가 본 체인의 v0 invariant. 두 thesis 는 reader 의 takeaway 를 갈라놓는다 |
| "Evidence pool 쓰면 너무 답답하다, 그냥 자연스럽게" | "자연스럽게" = 추측 채움 = hallucination. pool 밖 사실이 필요하면 dump 에 추가하고 pool 도 갱신 |
| "Emphasis 3개는 너무 적다, 5~7개로" | budget 늘리면 polish 단계 audit 의 의미가 약해진다. 정말 N>3 이 필요한 long-form 만 예외 |
| "dump 가 비어있는데 그냥 자동 검색 해주면 편하지" | 사용자 명시 동의 없이 자동 검색 = 본 체인의 명시적 non-goal. (A)/(B) 옵션 제시 후 답 받기 전 검색 금지 |
| "사인오프 안 받았어도 다음 단계로 그냥 가도" | 사인오프 게이트가 본 체인 가치의 절반. 침묵 = 대기, 다음 스킬 invoke 금지 |

## Red Flags

- Reader 가 "기술 블로그 독자 일반" 같은 추상
- thesis 가 두 문장으로 갈라짐
- Emphasis budget 비어있거나 0개, 또는 4개+
- Evidence pool 의 항목에 ID 없음
- Non-goals 가 빈 리스트
- 사용자 사인오프 전에 `writing-outline` 호출

**Any of these: stop. 해당 필드를 다시 채우고 사인오프 받기 전 다음 단계 금지.**
