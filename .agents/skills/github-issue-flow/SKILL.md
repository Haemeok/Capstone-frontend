---
name: github-issue-flow
description: Use when the user asks to create or separately track a GitHub issue, or when a clearly out-of-scope defect needs confirmation before tracking. Drafts a five-section English issue, applies type and area labels, and records the issue number in `.codex/state/active-issue` for the next PR.
---

# github-issue-flow

작업 중 발견된 사이드 이슈를 정해진 영문 5섹션 템플릿으로 GitHub에 등록하고, `.codex/state/active-issue` 파일에 번호를 누적해 다음 PR 본문에 자동 연결되게 한다.

## When to invoke

**즉시 발동 (확인 없음):**
- "이슈로 파/만들/열어줘"
- "track this as an issue", "open an issue"
- 사용자가 `/issue` 명시

**확인 후 발동 ("이슈로 분리할까요?" 한 줄 확인 후 진행):**
- "이건 따로 봐야겠다", "지금 작업 범위 밖이네"
- "여기 버그 있는데 나중에…", "이거 별도로 빼자"
- Codex 자체가 작업 중 *명백히 별개*인 결함/개선점을 발견한 경우 (단, **같은 세션 내 같은 영역에서 한 번 거절당하면 재제안 금지**)

**발동 안 함:**
- 코드 안의 `// TODO` 코멘트
- 사용자가 즉시 작업에 들어가는 경우
- 이미 `.codex/state/active-issue`에 있는 번호와 중복된 신호

## Workflow

### Step 1: Draft 작성

다음 5섹션 영문 템플릿으로 본문을 작성한다. 제목은 영문 한 줄 요약, 80자 이내, 영역 접두 없이 평문.

```markdown
## Background
<왜 이슈로 분리됐는지 — 어떤 작업 중 발견되었는지. 영문 한 단락.>

## Problem
<무엇이 문제인지 영문 한 단락.>

## Steps to reproduce / Observed
<재현 단계 또는 관찰된 동작. 번호 매김 가능. enhancement성이면 한 줄 Observed로 갈음.>

## Expected
<기대 동작 영문 한 단락.>

## Candidate approaches (optional)
- <접근 후보 1>
- <접근 후보 2>
```

Candidate approaches는 떠오르는 게 없으면 섹션 자체 생략.

### Step 2: 라벨 후보 결정

- 타입 1개: `bug` / `enhancement` / `documentation` / `question` 중 하나
- 영역 1~2개: `area:ui` / `area:api` / `area:ai` / `area:webview` / `area:infra` / `area:fsd` 중 해당하는 것
- 영역이 명확히 안 잡히면 영역 라벨 생략 가능

### Step 3: 사용자 승인

다음 형식으로 draft를 대화에 출력하고 확인 요청:

```
=== Issue draft ===
Title: <title>
Labels: <label1>, <label2>, <area:xxx>

Body:
<5섹션 본문 전체>
===================

이대로 만들까요? 수정 사항 있으면 알려주세요.
```

사용자 승인 받기 전엔 `gh issue create` 절대 호출 금지.

### Step 4: 필요한 영역 라벨 확인

승인된 영역 라벨만 `gh label list --limit 100`으로 확인한다. 없는 라벨은 아래 정의에 맞춰 `gh label create`로 생성한다. 이미 있는 라벨은 수정하지 않는다.

| 라벨 | 색상 | 설명 |
|---|---|---|
| `area:ui` | `FFB3BA` | Components, styles, design, a11y |
| `area:api` | `BAFFC9` | Server actions, fetch, auth, session |
| `area:ai` | `BAE1FF` | LLM, prompts, streaming, AI SDK |
| `area:webview` | `FFFFBA` | RN bridge, native integration |
| `area:infra` | `D5BAFF` | Build, deploy, CI, Sentry, env |
| `area:fsd` | `FFDFBA` | Architecture, layer violation, refactor |

### Step 5: 이슈 생성

PowerShell에서는 승인된 본문을 here-string 변수에 담아 전달한다. 임시 파일은 만들지 않는다.

```powershell
$body = @'
<승인된 본문 5섹션>
'@

$issueUrl = gh issue create `
  --title '<승인된 title>' `
  --body $body `
  --label '<type>,<area1>[,<area2>]'

$issueUrl
```

`gh issue create`는 성공 시 이슈 URL을 stdout으로 출력 (예: `https://github.com/Haemeok/Capstone-frontend/issues/123`).

### Step 6: 활성 이슈 파일에 번호 append

이슈 URL의 마지막 경로 조각에서 번호를 읽는다. `.codex/state/active-issue`를 확인한 뒤 번호가 없을 때만 `apply_patch`로 한 줄 추가한다. 파일이나 디렉터리가 없으면 `apply_patch`로 새로 만든다. 다른 활성 이슈 번호는 보존한다.

### Step 7: 사용자에게 결과 보고

```
이슈 #<NUMBER> 생성됨: <ISSUE_URL>
활성 이슈 파일에 추가했습니다. 다음 PR 본문에 자동으로 Closes #<NUMBER> 가 들어갑니다.
```

## 이슈 생성 실패 시

- `gh issue create`가 non-zero exit이면 활성 이슈 파일을 **건드리지 않음**
- 에러 출력 그대로 사용자에게 전달하고 멈춤

## 다중 이슈

한 작업 브랜치에서 여러 이슈를 만들 수 있다. 두 번째 이슈도 같은 워크플로로 처리하며, `.codex/state/active-issue`에 한 줄씩 누적된다. PR 본문 작성 시점에 `AGENTS.md`의 always-on 규칙이 각 줄을 `Closes #N`으로 변환한다.

## 사용자 escape hatch

`.codex/state/active-issue` 파일을 직접 편집해서 특정 줄을 지우면, 그 이슈는 다음 PR에서 빠진다. 별도 명령 없이 텍스트 한 줄 지우는 것으로 충분.
