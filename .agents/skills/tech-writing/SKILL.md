---
name: tech-writing
description: Korean developer technical writing for blog posts, portfolio docs, and 자기소개서 (Korean conglomerate cover letters). Removes AI-sounding patterns, writes like a real human developer. Three modes - portfolio (formal), blog (casual), jasoseo (Korean job application).
license: MIT
metadata:
  author: recipio
  version: "1.3.0"
---

# Tech Writing Skill — Human-Like Korean Developer Writing

This skill ensures all Korean technical writing (blog posts, portfolio docs, post-mortems, cover letters) reads like a real developer wrote it — not an AI. It removes AI-sounding patterns and applies natural developer voice.

## Three Modes

Determine the mode from context:

- **Portfolio mode**: Files in `docs/**/portfolio*`, `docs/**/specs/*`, or when user mentions 포트폴리오
- **Blog mode**: Files matching `*article*`, `*blog*`, or when user mentions 블로그/기술블로그
- **Jasoseo mode** (자소서): Files matching `*자소서*`, `*이력서*`, `*채용*`, or when user mentions 자소서/자기소개서/지원서/채용지원. Korean conglomerate cover letter conventions differ sharply from portfolio writing.

---

## Banned AI Patterns (Both Modes)

These 11 patterns make text immediately recognizable as AI-generated. **Never use them.**

### 1. Bold structural labels

**Banned:** Using `**라벨:**` to structure narrative paragraphs.

```
❌ **유저 제보:** "결과가 사라져 있어요."
❌ **원인 분석:** WebView가 백그라운드에서...
❌ **근본 원인:** v1은 클라이언트가...
```

Instead, flow naturally as paragraphs. Bold is only for **emphasizing key terms** within sentences, never for labeling analysis steps.

### 2. Evaluative adjectives

**Banned:** 치명적인, 혁신적인, 획기적인, 강력한, 놀라운, 심각한

These judge on behalf of the reader. Senior engineers want to judge for themselves.

```
❌ 치명적인 UX 결함을 발견했습니다
✅ "다른 앱 갔다 돌아오면 결과가 사라진다"는 제보를 받았습니다
```

Let the phenomenon speak for itself. Numbers and user quotes convey severity better than adjectives.

### 3. English parenthetical glosses

**Banned:** Dual-language hedging like 일시 중단(suspend), 선언적(declarative)

Pick one language. Korean developers either use the Korean term or the English term — not both in parentheses.

```
❌ OS가 JavaScript 실행을 일시 중단(suspend)하여
✅ OS가 JS 실행을 중단하기 때문에
```

Exception: First occurrence of a technical acronym (e.g., ISR(Incremental Static Regeneration)) is acceptable, but don't repeat it.

### 4. Legitimacy-proving phrases

**Banned:** 실제 운영 중인 서비스에서, 실제 프로덕션 환경에서

Real developers don't prove their project is real. They just state facts.

```
❌ 실제 운영 중인 서비스에서 사용자 DM을 통해 발견했습니다
✅ 사용자 제보로 발견했습니다
```

### 5. "기존에는 A. 그러나 B" contrast formula

**Banned:** Starting with a setup sentence, then "그러나" / "하지만" as a new sentence for contrast.

```
❌ 기존에는 문제가 없었습니다. 그러나 WebView로 전환한 직후, 문제를 발견했습니다.
✅ 웹 브라우저에서는 문제가 없었지만, WebView 앱으로 전환하면서 문제가 발생했습니다.
```

Use "~했지만", "~였는데", "~였고" to transition within a single sentence.

### 6. Repetition / restatement

**Banned:** 즉, 다시 말해, 결론적으로, 요약하면

AI loves restating the same idea in different words. Say it once and move on.

```
❌ 경로별 불일치가 구조적으로 불가능해졌습니다. 즉, 어떤 경로에서 호출하든 동일한 결과를 보장합니다.
✅ 경로별 불일치가 구조적으로 불가능해졌습니다.
```

### 7. Over-structured analysis

**Banned:** Labeling every step of analysis (Problem → Cause → Root Cause → Solution) as separate formatted sections within a paragraph.

Let the narrative flow carry the analysis. Use section headers (##, ###) for major breaks, not bold labels for every sub-step.

### 8. Hedge expressions

**Banned:** ~할 수 있습니다, ~라고 할 수 있겠습니다, ~일 수도 있습니다

AI hedges to avoid committing. Real developers state what happened definitively.

```
❌ 이를 통해 성능이 개선될 수 있었습니다
✅ 성능이 개선되었습니다
```

### 9. Intensifier adverbs without data

**Banned:** 매우, 상당히, 극적으로, 크게, 획기적으로 (when not backed by numbers)

```
❌ 성능이 매우 크게 향상되었습니다
✅ FCP 6.9초 → 2.04초로 70% 단축
```

If you have numbers, use them. If you don't have numbers, don't exaggerate.

### 10. "~을 통해" overuse

AI connects every means with "~을 통해". Vary the connectors.

```
❌ ISR 도입을 통해 성능을 개선하고, 태그 세분화를 통해 일관성을 확보했습니다
✅ ISR을 도입하여 성능을 개선하고, 태그를 세분화해서 일관성을 확보했습니다
```

Alternatives: ~로, ~해서, ~하여, ~덕분에, ~기 때문에

### 11. 동의어 회전 (synonym cycling)

**Banned:** 같은 대상을 매 문장 다른 표현으로 바꿔 부르며 돌리기.

```
❌ 주인공은 이내 결심한다. 핵심 인물은 곧 행동에 나섰다. 중심 인물의 선택은 결국...
❌ 이 컴포넌트는 데이터를 받아온다. 해당 모듈은 상태를 갱신하고, 이 요소는 결과를 그린다.
✅ 주인공은 이내 결심한다. 그는 곧 행동에 나섰고, 그 선택은 결국...
✅ 이 컴포넌트는 데이터를 받아 상태를 갱신하고 결과를 그린다.
```

AI는 "표현이 단조로우면 안 된다"는 통계적 직관 때문에 동일 대상을 동의어로 회전시킨다. 사람은 가장 명확한 명사 하나를 골라 반복하고, 필요하면 대명사로 받는다. 같은 사물·기능·역할을 가리킬 때는 한 번 고른 표현을 끝까지 쓴다.

### 12. 자기비하·성과 축소 (Self-deprecation / value-deflation)

**Banned:** 글이 X를 해낸 이야기인데, 본문에서 "사실 별거 아니다 / 안 한 것도 있다 / 초라하다"로 자기 성과를 깎는 곁가지.

```
❌ 안 쓰는 코드라 손대지 않고 뒀습니다        (글 주제와 무관한 "미적용" 자백)
❌ 결국 값어치 있는 건 한 곳뿐이었던 셈입니다   (성과 축소)
❌ 100곳을 뒤진 것치고는 초라해 보이지만        (자기 작업 폄하)
✅ (한 일과 그 결과만 서술. 안 한 것·주제 밖은 본문에 자백하지 말고 그냥 뺀다)
```

**Human Writing #3(Admit failures honestly)과 혼동 금지.** #3은 _여정의 일부인 실패_(시도 → 실패 → 다음 시도)를 공유해 최종 해법을 값지게 만드는 것이다. #12는 *최종 성과 자체*를 깎는 자백 — "이거 사실 별거 아님", "저건 안 했음(주제 밖인데도)", "초라함". 전자는 서사의 연료, 후자는 독자 신뢰를 스스로 무너뜨린다.

규칙: 일부러 안 다루기로 한 것(non-goal)은 **outline의 cut list로 조용히 빼는 것**이지, 본문에서 "이건 안 했습니다"라고 사과·자백하는 게 아니다. thesis가 "X를 했다 / X가 답이다"이면 본문 어디에도 X를 스스로 축소·폄하하는 문장을 두지 않는다. 리팩토링·개선 과정을 다루는 글일수록 이 자백이 서사를 정면으로 깎으니 특히 경계.

---

## Human Writing Patterns (Both Modes)

These 12 patterns are extracted from real Korean tech blog posts (당근, 카카오페이증권, 무신사). Apply them to make writing feel natural.

### 1. Paragraph flow over labels

Write in flowing paragraphs. Never label analysis steps with bold text within a paragraph.

### 2. Concrete example → abstraction

Show the specific case first, then generalize.

```
✅ "노스페이스 화이트라벨 미니백" 같은 게시글이 있다면, 이를 핵심 표현으로 요약한 뒤 임베딩을 만드는 거예요.
❌ 임베딩 기반 요약 기법을 적용했습니다. 예를 들어 "노스페이스 화이트라벨 미니백"...
```

### 3. Admit failures honestly

Include what didn't work. Real developers share failures.

```
✅ "시도했으나 채택하지 않은 전략"
✅ "직관적으로는 좋아질 것 같았는데, 실제로는 성능 변화가 미미했어요"
```

### 4. Rhetorical questions

Use questions to introduce sections or transitions.

```
✅ 왜 규칙을 알려줘도 안 지켜질까?
✅ 왜 파티션과 컨슈머 수를 다르게 했을까요?
```

### 5. Results upfront (blog mode especially)

State the outcome early, then explain how.

```
✅ 결과부터 말하면: 로그 지연 수분~수시간 → 20초 이내, 비용 85.6% 절감
```

### 6. Journey narrative

Tell the story chronologically: first attempt → problem → next attempt → final solution.

### 7. Metaphors and analogies

Use relatable comparisons to explain technical concepts.

```
✅ Lint는 맞춤법 검사기입니다. 아키텍처 검증은 글 전체의 구조적 일관성을 보는 일입니다.
✅ 캐시 무효화는 도서관 색인 갱신과 같습니다 — 책은 그대로인데 색인이 옛 위치를 가리키면 아무도 못 찾습니다
```

### 8. Direct quotes

Use actual user feedback, team conversations, or error messages.

```
✅ "로그 조회가 너무 느려요. 5분 넘게 걸릴 때도 있어요."
✅ Codex: "레이어 의존성 위반이 있습니다. Service를 통해 접근하도록 수정하겠습니다."
```

### 9. Tables for data only

Use tables exclusively for: Before/After comparisons, tech comparisons, performance metrics. Never for narrative structure.

### 10. Code blocks flow naturally

Introduce code with a simple sentence, not a label.

```
✅ 실제 설정은 간단해요.
   [code block]
❌ **설정 코드:**
   [code block]
```

### 11. First-person plural

Write from the team's perspective: 우리는, 저희는, 저희 팀이.

### 12. Casual causal explanations (blog mode)

Use conversational connectors for explaining reasons: ~거든요, ~기도 하고, ~기 때문이에요.

---

## Detailed references

Read only the reference that matches the current writing task:

- For a long-form article's narrative architecture, failed-attempt sequence, pivot, comparisons, metrics, or metaphors, read [article-architecture.md](references/article-architecture.md).
- For a portfolio document or technical blog, read [portfolio-blog-modes.md](references/portfolio-blog-modes.md) before drafting or correcting mode-specific tone and structure.
- For a Korean company cover letter (자소서), read [jasoseo-mode.md](references/jasoseo-mode.md) before drafting or correcting any answer.

---

## Correction Workflow

When editing existing text to remove AI patterns:

1. **Scan for banned patterns.** Check all 11 banned patterns. Mark every violation.
2. **Check Problem/Key Action separation** (portfolio mode). Does Problem contain solutions? Does Key Action repeat Problem?
3. **Remove bold labels.** Convert labeled sections to flowing paragraphs.
4. **Kill evaluative adjectives.** Replace with facts/numbers.
5. **Merge "기존~그러나~" sentences.** Use "~했지만" within one sentence.
6. **Remove parenthetical enumerations.** Replace with Korean descriptions.
7. **Read aloud test.** Would a Korean developer actually say this out loud to a colleague? If not, rewrite.

### Jasoseo-Specific Correction Checklist

Run these **in addition** to the general checks when in Jasoseo mode:

1. **진부어 8대악 grep.** Search for 성실/노력/책임감/솔선수범/창의적/도전적/열정/꼼꼼 and replace with actions or numbers.
2. **당사/귀사/이 회사 → 기업명.** Even one occurrence is a red flag.
3. **1인칭 주어 count.** If "저는/제가/저의" appears more than 2~3 times per 1000자, drop the subject.
4. **Hedge cleanup.** Search with `rg` for 아마도/~수도/~같습니다/~하려고/~하고 싶습니다 and convert to declarative.
5. **Bracketed subtitle audit.** Each subtitle under 30자, no slogans/proverbs, prefer "How + Result" format.
6. **Keyword match against JD.** Paste the job description next to your draft; JD keywords should appear verbatim in subtitles or first sentence of each section.
7. **인재상 echo.** The company's 인재상 words should be **implicitly** reflected in tone (e.g., "겸손" → self-score under 80). Don't quote the 인재상 verbatim — that's lazy.
8. **Character count ≤ 1000 with spaces.** Verify with the Python one-liner. Trim English first before cutting content.
9. **No emoji, no icons.** Korean HR forms strip them, and they read as unprofessional in formal applications.
10. **First-paragraph test.** Read only the first paragraph of each answer. Does it already communicate the core answer? If no, rewrite to 두괄식.
11. **Overlap matrix.** List core episodes as rows, question numbers as columns. Mark ✓ where each episode appears. If any episode is ✓ in 2+ columns at the same depth, apply Episode Role Separation — demote all but one to one-liner examples.
12. **Subtitle-body keyword search.** For each `[subtitle]`, extract its anchor keyword(s) and confirm they appear in the opening sentence of the body, not buried in a tail line.
13. **Number consistency sweep.** Run `rg -n "MAU|DAU|[0-9]+만"` across the whole document — all same-metric occurrences must match.
14. **Tense continuity check.** Read each paragraph's last sentence and the next paragraph's first sentence as a pair. Past-definitive (~했습니다) should not immediately precede future-promise (~겠습니다) across paragraphs without a present-habitual (~합니다) bridge.

---

## Self-Audit Pass (마지막 의심 단계)

체크리스트를 다 통과해도 글에는 **AI 냄새가 잔향처럼 남는다**. 마지막에 한 번 더, 룰이 아니라 의심으로 읽는다. 이 단계는 새 글을 쓴 직후에도, 기존 글을 교정한 직후에도 반드시 거친다.

### 단일 자가질문

> **"이 글을 처음 보는 한국 개발자에게 보여줬을 때, 어느 문장에서 'AI가 썼나?' 하는 생각이 들 것 같은가?"**

이 질문 하나만 들고 글을 처음부터 끝까지 다시 읽는다. 룰북에는 없지만 이상하게 느껴지는 문장을 찾는 것이 목적이다.

### 자주 걸리는 잔향

체크리스트로 잡히지 않는 미묘한 패턴들:

- **체크리스트는 통과했는데 정보 밀도가 균일한 문장.** 사람 글은 한 문단 안에서도 강약이 있다. 모든 문장이 같은 호흡·같은 정보량이면 AI 냄새가 난다.
- **단어 선택은 자연스러운데 흐름이 너무 매끈한 단락.** 사람은 중간에 한 박자 끊거나 곁가지로 새었다 돌아오는 일이 잦다. 단락 전체가 한 호흡으로 매끄럽게 이어지면 인공적이다.
- **모든 문단이 비슷한 길이.** 짧은 문단(1~2 문장)과 긴 문단(5~7 문장)이 섞여야 사람 글이다.
- **결론이 "교과서적으로" 정확함.** 마지막 문단이 모범답안처럼 깔끔히 정리되면 사람이 아니다. 진짜 글은 한 톤 비스듬한 마무리·다음 과제 언급·미해결 부분 인정 중 하나로 끝난다.
- **"우리는 ~을 배웠습니다" 류의 메타 마무리.** 학습한 내용을 정리하기보다 다음에 무엇을 시도할지 한 줄로 끝내는 편이 자연스럽다.

### 처리

잔향이 감지된 문장은 **고치는 게 아니라 잘라내거나 다시 쓴다**. 일부 단어 교체로는 사라지지 않는다. 한 문장을 두 문장으로 쪼개거나, 반대로 두 문장을 한 호흡으로 합치는 식으로 호흡을 바꾼다.

이 단계가 끝나면 작업 종료. 추가 룰을 발견했다면 본 스킬에 새 패턴으로 등재할 후보로 적어둔다.
