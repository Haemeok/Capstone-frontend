---
name: tech-writing
description: Korean developer technical writing for blog posts and portfolio docs. Removes AI-sounding patterns, writes like a real human developer. Two modes - portfolio (formal) and blog (casual).
license: MIT
metadata:
  author: recipio
  version: "1.0.0"
---

# Tech Writing Skill — Human-Like Korean Developer Writing

This skill ensures all Korean technical writing (blog posts, portfolio docs, post-mortems) reads like a real developer wrote it — not an AI. It removes AI-sounding patterns and applies natural developer voice.

## Two Modes

Determine the mode from context:
- **Portfolio mode**: Files in `docs/**/portfolio*`, `docs/**/specs/*`, or when user mentions 포트폴리오
- **Blog mode**: Files matching `*article*`, `*blog*`, or when user mentions 블로그/기술블로그

---

## Banned AI Patterns (Both Modes)

These 10 patterns make text immediately recognizable as AI-generated. **Never use them.**

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
✅ 왜 교과서는 한계가 있을까?
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
✅ "교과서 vs 시험지" — 규칙을 알려주는 것과 어기면 안 되게 만드는 것의 차이
```

### 8. Direct quotes
Use actual user feedback, team conversations, or error messages.
```
✅ "로그 조회가 너무 느려요. 5분 넘게 걸릴 때도 있어요."
✅ Claude: "레이어 의존성 위반이 있습니다. Service를 통해 접근하도록 수정하겠습니다."
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

## Structural Patterns (Article Architecture)

Beyond avoiding AI patterns and applying human voice, these structural patterns determine whether an article is *compelling* or merely *correct*. Extracted from analyzing the narrative architecture of 3 published Korean tech articles.

### 1. Destination First
Reveal the key outcome early — in the introduction or within the first 3 paragraphs. Don't save the "big reveal" for the end. Readers stay engaged when they know the destination and want to learn the route.

```
✅ 결과부터 말하면: 로그 지연 수분~수시간 → 20초 이내, 비용 85.6% 절감. 어떻게 이런 결과를 만들었을까요?
❌ [10 paragraphs of journey] ... 그래서 최종적으로 85.6% 절감이라는 결과를 얻었습니다.
```

### 2. Failed Approaches as Narrative Fuel
Before presenting the final solution, describe 2-3 approaches that were tried and fell short. This isn't filler — it's what makes the chosen solution feel *earned*. Each failed approach should explain WHY it failed, building the constraints that shaped the final answer.

```
✅ 첫 번째 시도 — 코드 리뷰에서 잡자. (...) 문제는 리뷰어의 부담이 비례해서 커진다는 점이었습니다.
   두 번째 시도 — AI에게 교과서를 읽어주자. (...) 대부분은 따랐지만, "대부분"이 문제였습니다.
```

### 3. The Mid-Article Pivot (Problem Reframing)
The strongest articles have a moment where the *problem itself is reframed*, not just the solution. This is the emotional peak — the insight that changes the direction.

```
✅ "그래서 시선을 바꿨어요. 어떻게 LLM이 최적을 뽑게 할지가 아니라, 애초에 어떤 카테고리를 LLM에게 쥐어줄지를 설계하는 방향으로."
✅ "필요한 것은 더 좋은 교과서가 아니라 시험지였습니다."
```

### 4. Decision Justification with "Why Not" Table
When presenting a technology choice, show ALL candidates with specific reasons each was rejected. Don't just list the winner's features — explain why losers lost.

```
✅ | 솔루션 | 강점 | 우리에게 맞지 않았던 이유 |
   | OpenSearch | 전문 검색에 강함 | 비용이 높고, 대용량 집계가 느림 |
   | Loki | 저비용 | 복잡한 쿼리 불가, 집계 약함 |
   | ClickHouse ✓ | 고속 집계, 압축률 우수 | 전문 검색은 약하지만 우리 패턴의 90%가 필드 조건 검색 |
```

### 5. Metrics Always in Pairs
Never present a number alone. Every metric needs a baseline, comparison, or competing dimension.

```
✅ FCP 6.9초 → 2.04초 (70% 단축)
✅ 무효화 범위: 전체 6개 → 관련 3~4개
❌ FCP를 2.04초로 개선했습니다 (baseline 없음)
❌ 정확도 87% 달성 (이전 대비? 다른 모델 대비?)
```

### 6. Natural Language Rule → Implementation
For each technical decision, first state it as a one-sentence human-readable principle, then show the implementation. This makes code meaningful instead of just present.

```
✅ "BFF든 Server Action이든, 같은 이벤트에는 같은 태그가 무효화되어야 한다."
   → getTagsToInvalidate(event) 정책 함수로 중앙화

✅ "Repository가 Controller를 참조하면 안 된다."
   → ArchUnit layeredArchitecture() 테스트
```

### 7. Extended Metaphor as Structural Glue
Choose one central metaphor and thread it through section headers and transitions. This creates narrative cohesion for long technical articles.

```
✅ 무신사: "교과서 vs 시험지" → 섹션 제목: "교과서의 한계", "시험지의 가능성", "선생님 세팅하기", "선생님의 훈련 과목"
✅ 카카오: "호그와트 도서관" → 프로젝트 이름 자체가 메타포
```

### 8. Anchor Abstractions with Concrete Scenes
Start abstract concepts with a specific, visualizable moment — a code review scene, an error message, a user complaint, a Slack message.

```
✅ "어느 날 코드 리뷰를 하다가 익숙한 장면을 마주했습니다. Repository 클래스가 Controller를 직접 참조하고 있었습니다."
❌ "아키텍처 규칙 준수는 코드 품질에 중요한 요소입니다."
```

---

## Portfolio Mode

Use when writing portfolio documents, project descriptions for job applications, or technical accomplishment summaries.

### Tone
- **Sentence ending:** ~했습니다, ~이었습니다 (formal declarative)
- **Voice:** Confident, factual, concise
- **No conversational fillers:** Don't use ~거든요, ~해요, ~이에요

### Structure
Portfolio docs follow a fixed structure. Keep it but make it read naturally:
- **Problem & Analysis**: What was broken and why (facts only, no solutions here)
- **Key Actions**: What you did and how (the solution, with enough technical detail)
- **Result**: Measurable outcome

### Rules
1. **One sentence = one piece of information.** No compound sentences with 3+ clauses.
2. **No parenthetical enumeration.** Don't list items in parentheses: (`jobId`, `status`, `progress`). Use Korean descriptions instead: "작업 상태, 진행률, 결과 ID를 포함한"
3. **Problem section contains ONLY problems.** No solutions, no "we designed X" — that goes in Key Actions.
4. **No redundancy between Problem and Key Actions.** If Problem says "하이브리드 구조로 설계했습니다", Key Actions must not repeat "하이브리드 구조를 설계했습니다".
5. **Numbers over adjectives.** Always prefer "FCP 6.9초 → 2.04초" over "FCP를 대폭 개선".
6. **Max 2-3 code-level terms per section.** Variable names, tag names, enum values — keep to a minimum. The reader is a hiring manager, not a code reviewer.
7. **[해결] [결과] tags are OK** as section markers within Key Actions — they provide scannable structure without the AI-label problem (they're not bolded inline labels).

### Example (Good Portfolio Problem)
```
레시피오는 20,000개 이상의 레시피 페이지를 서빙합니다. 초기 CSR 구조에서
FCP 개선과 캐시 이점을 위해 ISR로 전환했지만, FCP는 6.9초로 여전히 느렸습니다.
Chrome DevTools Network Waterfall 분석 결과, 폰트와 이미지가 동시에 로딩되며
대역폭을 경합하는 것이 병목이었습니다.
```

---

## Blog Mode

Use when writing tech blog posts, engineering blog articles, or team retrospectives.

### Tone
- **Sentence ending:** ~해요, ~이에요, ~거든요, ~었어요 (casual conversational)
- **Voice:** Friendly, narrative, sharing-a-story
- **Conversational fillers OK:** ~거든요, ~기도 하고, ~인 거죠

### Structure
Blog posts are free-form but typically follow:
1. Team/author intro + context
2. Problem setup (often with user quotes or data)
3. Solution journey (chronological, including failed attempts)
4. Results and learnings
5. Future plans

### Rules
1. **Tell the journey, not just the conclusion.** Include what you tried first, what failed, what you learned.
2. **Use rhetorical questions** to introduce sections: "그래서 어떻게 해결했을까요?"
3. **Admit failures explicitly.** "직관적으로는 좋아질 것 같았는데, 실제로는 미미했어요."
4. **Metaphors welcome.** "호그와트 도서관", "교과서 vs 시험지" — make complex ideas relatable.
5. **Direct quotes from users/team** add authenticity.
6. **"결과부터 말하면:"** is a great pattern for hooking the reader early.
7. **Tables for data comparisons**, paragraphs for narrative. Never mix.
8. **Code blocks introduced casually:** "실제 설정은 간단해요." then the code.

### Example (Good Blog Opening)
```
안녕하세요. 카카오페이증권 DevOps 팀 Sean.baek (션), Lina.a (리나)에요.

2022년 9월에 입사했을 때, 하루에 쌓이는 로그는 약 100GB였어요. 그때는
로깅 시스템이 큰 고민거리가 아니었죠. 그런데 서비스가 빠르게 성장하면서
상황이 달라졌어요. 로그가 폭발적으로 늘어나기 시작한 거예요.
```

---

## Correction Workflow

When editing existing text to remove AI patterns:

1. **Scan for banned patterns.** Check all 10 banned patterns. Mark every violation.
2. **Check Problem/Key Action separation** (portfolio mode). Does Problem contain solutions? Does Key Action repeat Problem?
3. **Remove bold labels.** Convert labeled sections to flowing paragraphs.
4. **Kill evaluative adjectives.** Replace with facts/numbers.
5. **Merge "기존~그러나~" sentences.** Use "~했지만" within one sentence.
6. **Remove parenthetical enumerations.** Replace with Korean descriptions.
7. **Read aloud test.** Would a Korean developer actually say this out loud to a colleague? If not, rewrite.
