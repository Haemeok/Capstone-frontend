---
name: writing-polish
description: Use when working doc has a completed Draft and needs final passes — tech-writing rule sweep, fresh-Claude reader test, and emphasis audit — before publishing. Triggers when AI rushes a draft to velog without verification, when shipped articles failed to communicate the intended thesis, or when emphasis count drifted past the budget during drafting.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Writing Polish

> 글쓰기 체인의 네 번째이자 *마지막* 단계. draft 가 완성된 working doc 을 받아 3 패스로 검증 후 종료. 다음 스킬 invoke 없음. velog 호출은 사용자 몫.

## Where this sits

```
writing-thesis  ──▶  writing-outline  ──▶  writing-drafting  ──▶  writing-polish
                                                                  (THIS: 3 패스 후
                                                                   체인 종료)
                                                                       │
                                                                       ▼
                                                              (사용자가 velog 별도 호출)
```

## Terminal — no handoff

본 스킬은 체인 종료점. 다음 스킬 자동 invoke 0건. velog / 외부 publish 도구 호출 0건. publish 는 사용자가 명시적으로 요청할 때만 본 스킬 외부에서 수행.

## Input

working doc 에 `## Draft` 섹션이 *완성되어 있어야* 한다 (비어있지 않음).

**`## Draft` 없거나 비어있으면 STOP.** "Draft 없음. `writing-drafting` 먼저" 보고. polish notes 추가 0건.

## Output

`## Draft` 본문 *인플레이스 수정* + `## Polish notes` 섹션 append. frontmatter `status: done`.

```markdown
## Polish notes

### AI pattern fixes (패스 1)
- <섹션 이름>: <어떤 패턴이 어떻게 바뀌었는지>
- 또는 "변경 없음"

### Reader test (패스 2)
- Predicted thesis: "<서브에이전트가 추측한 thesis>"
- Match? <Y | N — Thesis 섹션 thesis 와 의미 비교>
- Predicted emphasis: <서브에이전트가 추출한 강조 N개>
- Bloat sections: <군더더기로 지목된 섹션>

### Emphasis audit (패스 3)
- Removed N bold from sections X, Y
- 또는 "변경 없음"
```

## The Method (3 패스, 순서대로)

### 패스 1 — tech-writing 룰 패스

`Skill` 도구로 `tech-writing` 스킬 invoke. 본문 (`## Draft`) 에 AI 패턴 11종 + 인간 패턴 12종 + Self-Audit Pass 적용. 적용 후 변경된 부분을 polish notes "AI pattern fixes" 에 짧게 기록 (어느 섹션의 어떤 패턴이 어떻게 바뀌었는지). 변경 없으면 "변경 없음" 명시.

사용자가 "tech-writing 안 돌려도" 같은 옵트아웃 요청 시 — 명시 동의 받고 (한 줄 confirm) 만 스킵. silently 스킵 금지.

### 패스 2 — Reader test (fresh 서브에이전트)

`Agent` 도구로 fresh 서브에이전트 1명 dispatch. **prompt 에 `## Draft` 본문만 포함** — `## Thesis` / `## Outline` / `## Polish notes` 절대 미포함 (오염되면 test 자체 무효).

서브에이전트에게 3개 질문:

1. "이 글의 thesis 를 한 문장으로 추측해줘"
2. "이 글이 강조하는 포인트를 N개 (working doc 의 emphasis budget 갯수와 동일) 뽑아줘"
3. "어느 섹션이 군더더기로 느껴져?"

응답을 polish notes "Reader test" 에 그대로 기록. predicted thesis 가 working doc 의 Thesis 섹션 thesis 와 의미적으로 일치하면 "Match: Y". 다르면 "Match: N" + 사용자에게 "thesis 전달 실패, 재작성 권장" 보고. **자동 재작성 금지** — 사용자 결정에 맡김.

### 패스 3 — Emphasis audit + 미해결 `??` 마커 점검

`## Draft` 본문의 bold (`**...**`) 와 H2/H3 위계를 grep. 각각이 Thesis 섹션의 emphasis budget 항목 N개 중 하나에 의미 매핑되는지 확인.

매핑 안 되는 강조가 있으면 — 사용자에게 "초과 강조 N개 — (목록). 어느 걸 제거?" 보고 후 응답 받아 제거. 응답 전 자동 제거 0건. 매핑 안 되는 게 없으면 "변경 없음" 기록.

추가로 `?? — 사용자 확인 필요` 마커 (drafting 이 evidence pool 밖 사실에 단 마커) 가 본문에 남아있는지 grep. 있으면 사용자에게 "미해결 마커 N개: <섹션 위치>. publish 전 evidence pool 갱신 또는 본문 수정 필요" 보고. 자동 채움 0건.

## Terminal action

3 패스 끝나면:

- frontmatter `status: done` 으로 갱신
- 사용자에게 "polish 완료. working doc 경로: `<path>`. velog 등 publish 는 사용자가 직접 호출하세요" 안내
- **다음 스킬 invoke 0건** — velog / 외부 publish / 이미지 생성 / Bash 로 `upload.py` / `generate_image.py` 등 일체 호출 금지

## Rationalizations — STOP

| Excuse | Reality |
|---|---|
| "패스 1 (tech-writing) 은 자기 가 다 알고 있으니 스킵" | tech-writing 의 자가감사 (Self-Audit Pass) 가 잔향까지 잡음. 본 스킬이 직접 재구현하면 룰 drift 발생 |
| "reader test 의 서브에이전트에 Thesis 도 같이 줘야 정확" | Thesis 주는 순간 test 무효. fresh = 컨텍스트 격리가 본질. draft 만 보고 thesis 가 read off 되어야 글이 성공한 거 |
| "thesis 미스매치면 내가 자동으로 다시 써주는 게 친절" | 자동 재작성 = 본 스킬의 명시적 금지. 사용자 결정 영역 |
| "emphasis 초과면 알아서 깎아도 돼" | 사용자가 어느 강조를 살릴지 모름. 동의 없이 제거 0건 |
| "polish 끝나면 velog 자동 호출이 편함" | 사용자가 옵션 C 로 velog 분리 명시. terminal = handoff 없음 |
| "썸네일 이미지라도 미리 만들어두면 도움" | 이미지 생성 / 외부 API 호출 = publish 류 동작 = terminal 룰 위반 |

## Red Flags

- 패스 1 에서 tech-writing 스킬 호출 0건
- 서브에이전트 dispatch 의 prompt 에 `## Thesis` / `## Outline` 단어 등장
- thesis 미스매치 후 자동 재작성 시도
- emphasis 초과분이 사용자 응답 없이 제거됨
- polish 끝나는 시점에 velog / publish / 이미지 / Bash `upload` 류 호출
- frontmatter `status` 가 `done` 아님

**Any of these: stop. terminal 룰을 어긴 거. 호출 되돌리고 사용자에게 보고.**
