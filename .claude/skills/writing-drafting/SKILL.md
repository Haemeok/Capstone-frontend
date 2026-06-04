---
name: writing-drafting
description: Use when working doc has an approved Outline and you need to draft body prose section by section with sign-off gates. Triggers when AI tries to draft the whole article in one shot, when drafting violates the emphasis budget by adding bold to non-budget facts, when hallucinated facts slip past evidence pool, or when tech-writing banned AI patterns leak into the first draft.
license: MIT
metadata:
  author: recipio
  version: "0.1.0"
---

# Writing Drafting

> 글쓰기 체인의 세 번째 단계. outline 이 결정된 working doc 을 받아 본문을 *섹션별로 한 개씩* 작성한다. 매 섹션마다 사용자 사인오프.

## Where this sits

```
writing-thesis  ──▶  writing-outline  ──▶  writing-drafting  ──▶  writing-polish
                                          (THIS: 섹션별           (3 패스)
                                           사인오프 + 강조
                                           예산 / evidence
                                           pool / banned
                                           pattern 즉시 차단)
```

## Input

working doc 에 `## Outline` 섹션 *완성되어 있어야* 한다.

**`## Outline` 없으면 STOP.** "Outline 섹션 없음. `writing-outline` 먼저" 보고 후 종료. `## Draft` 추가 0건.

## Output

같은 working doc 에 `## Draft` 섹션 append. 본문이 outline 순서대로 누적. frontmatter `status: drafting`.

## The Method

### 1. 한 번에 한 섹션만

outline 의 다음 미완성 섹션 *하나만* 본문으로 작성. 다음 섹션 절대 시작 금지. 사용자가 "다 한꺼번에 써줘" 라고 명시적으로 요청해도 거부 — "한 섹션씩 사인오프 — 정책 위반 불가" 보고.

### 2. 작성 시 즉시 차단 룰 (3종)

#### (a) Emphasis budget 외 강조 차단

본문에 `**...**` (bold) 또는 H3 이상 위계를 넣을 때 — Thesis 섹션의 emphasis budget 항목 중 하나에 의미적으로 대응해야 한다. 대응 안 되면 작성 시점에 자가 차단하고 일반 텍스트로 다시 씀.

#### (b) Evidence pool 외 사실 → `??` 마커

본문에 사실 / 수치 / 인용 / 결정 이유가 박힐 때 — Thesis 섹션의 Evidence pool 의 ID 중 하나에 대응해야 한다. 대응 안 되면 그 자리에 `?? — 사용자 확인 필요` 마커를 남기고 사용자에게 보고. **추측 값으로 채우지 말 것 — hallucination 차단.**

#### (c) tech-writing banned AI patterns 즉시 차단

다음 11종 패턴을 작성 시점에 차단 (polish 까지 미루지 않음):

1. 볼드 구조 라벨 (`**문제:**`, `**해결:**`)
2. 평가형 형용사 (치명적인, 혁신적인, 획기적인)
3. 영어 괄호 병기 (일시 중단(suspend))
4. 정당화 표현 (실제 운영 중인 서비스에서)
5. "기존 ~ 그러나 ~" 대조 공식 → "~했지만" 한 문장으로
6. 반복/재진술 (즉, 다시 말해, 결론적으로)
7. 과도한 라벨 구조
8. 헤지 (~할 수 있습니다, ~일 수도 있습니다) → 단정형
9. 데이터 없는 강조 부사 (매우, 상당히, 극적으로)
10. "~을 통해" 남발
11. 동의어 회전 (같은 대상을 매 문장 다른 표현)

(상세는 `tech-writing` 스킬 본문 참고. 본 단계는 *작성 시점*에 적용. polish 단계는 *재검*.)

### 3. 섹션 보여주기 + 사인오프 게이트

한 섹션 작성 후 사용자에게 본문 전체를 보여주고:

> "<섹션 제목> 끝. 다음 섹션 가도 됨?"

사용자 응답이 사인오프 ("ok" / "다음" / "ㅇ" 등 명시 긍정) 면 다음 섹션. 변경 요청이면 같은 섹션 안에서 처리 후 다시 보여줌. 침묵이면 대기 (다음 섹션 시작 금지).

### 4. 모든 섹션 끝 → polish handoff

outline 의 모든 섹션이 draft 에 들어가고 사용자가 마지막 사인오프 주면 `writing-polish` invoke. 마지막 섹션 사인오프 *전*에 session 종료되면 `writing-polish` 호출 0건.

## Handoff

`Skill` 도구로 `writing-polish` invoke. 모든 섹션이 사인오프 받았을 때만.

## Rationalizations — STOP

| Excuse | Reality |
|---|---|
| "사용자가 '한 번에 다 써줘' 요청하면 따라도" | 본 체인의 명시적 정책 위반. 사용자 요청보다 정책 우선. 거부 후 보고 |
| "Emphasis budget 보다 좋은 강조가 보이면 추가해도" | budget 늘리려면 thesis 단계로 돌아가야 함. drafting 안에서 늘리면 본 체인 가치 무너짐 |
| "Evidence pool 에 없어도 그 정도는 일반 상식이라 본문에 넣어도" | "일반 상식" 도 사용자 확인 받지 않은 추측이면 `??` 마커. 마커 다는 게 무거우면 사용자가 pool 갱신 |
| "banned pattern 은 polish 에서 잡아주니 일단 자유롭게" | polish 가 잡아주는 건 *잔향*. 작성 시점에 박힌 라벨식 bold 는 구조까지 흐트러뜨림 — polish 가 못 살림 |
| "사인오프 침묵은 묵시적 ok" | 침묵 ≠ 동의. 사용자 명시 긍정 없으면 다음 섹션 금지 |

## Red Flags

- 한 응답에 H2 섹션 2개 이상 본문이 들어감
- bold 가 emphasis budget 매핑 표 없이 박힘
- 본문에 `??` 마커 없는데 evidence pool 에 없는 수치/인용
- banned AI patterns 중 하나라도 본문에 등장
- 사인오프 메시지 없는 상태에서 `writing-polish` 호출
