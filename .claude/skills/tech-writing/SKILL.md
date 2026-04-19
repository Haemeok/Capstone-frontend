---
name: tech-writing
description: Korean developer technical writing for blog posts, portfolio docs, and 자기소개서 (Korean conglomerate cover letters). Removes AI-sounding patterns, writes like a real human developer. Three modes - portfolio (formal), blog (casual), jasoseo (Korean job application).
license: MIT
metadata:
  author: recipio
  version: "1.2.0"
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

## Jasoseo Mode (자소서 모드)

Use when writing Korean conglomerate cover letters (자기소개서). This mode combines portfolio's factual tone with conventions that Korean HR readers expect — and filters for AI-generated patterns that 2026 ATS systems penalize.

### Tone
- **Sentence ending:** ~했습니다, ~입니다 (formal declarative, same as portfolio)
- **Voice:** Confident but humble. Korean HR prizes "겸손하지만 열정적인" — self-assessment with room to grow beats chest-thumping.
- **1인칭 주어 최소화.** Korean readers find repeated "저는/제가/저의" amateurish. Drop the subject when context makes it obvious.

### Structure (two-level: section → bracketed subtitle)
Each response follows the **두괄식 3단 구조**:
1. **Core message** in the first sentence or bracketed subtitle
2. **Evidence from experience** (STAR: Situation/Task short, Action/Result specific with numbers)
3. **Connect to the company** (인재상, 핵심가치, 직무 키워드)

### Bracketed Subtitles (소제목)
Mandatory convention in Korean cover letters. Every 200~400자 block gets a `[소제목]`. Rules:
- **How + Result format:** `[측정으로 70% 단축, 협업으로 정합성 0건]` beats `[측정과 협업]`
- **Forbidden:** Slogans, movie titles, proverbs, advertising copy, 유행어. Readers read hundreds of these — clichés stand out badly.
- **Max 30자.** If longer, split into `[주제 | 서브]` format: `[레시피오 | 요구분석에서 배포까지]`
- **Job Description keyword matching:** Pack JD terms into subtitles (e.g., if JD says "요구분석/설계/개발/테스트/론칭", match subtitle sequence to those words). 2026 ATS prescreens weigh keyword density.

### Banned Words (진부어 8대악)
Korean HR surveys consistently rate these as the most overused — using them signals you don't know the job:
- 성실한 · 노력하는 · 책임감 있는 · 솔선수범 · 창의적 · 도전적 · 열정 · 꼼꼼

Also avoid: 완벽주의 · 법 없이도 살 사람 · 타고난 · 행운아 · 솔직히 말씀드리면 · 비록 지금은 부족하지만

Replacement strategy: replace adjectives with **actions** or **numbers**.
- ❌ 성실하게 임했습니다 → ✅ 3년간 꾸준히 풀어 백준 플래티넘에 도달했습니다
- ❌ 도전적으로 해결했습니다 → ✅ 라이브러리를 교체하는 대신 원인을 추적했습니다
- ❌ 열정적으로 공부했습니다 → ✅ 점수 지표로는 원인을 특정할 수 없어 워터폴 분석법을 별도로 학습했습니다

### Forbidden Phrasing
1. **Ambiguous company references.** Use the company name directly — `샘표`, `현대오토에버` — never `당사/귀사/이 회사`. Even if the prompt uses `당사`, the answer names the company. This signals research.
2. **Hedging adverbs.** `아마도`, `~할 수도`, `~일 것 같습니다` undercut authority. Use declarative.
3. **Casual abbreviations.** `알바`, `과대`, `총학` → `아르바이트`, `과대표`, `총학생회`.
4. **Loner rhetoric.** `혼자서도 잘합니다` reads as unteachable. Show ownership through results, not isolation.
5. **Family backstory / school rankings.** `부모님께서~`, `수석 졸업` — invisible signal of weak direct evidence.

### Modal Expressions to Delete
- 노력하겠습니다 → 하겠습니다 (delete the hedge)
- ~하려고 했습니다 → ~했습니다
- ~할 수 있습니다 → ~합니다
- 기여하고 싶습니다 → 기여하겠습니다 (when appropriate)

### Vague-Word Swap Table
| Before (모호어) | After (구체) |
|---|---|
| 다양한 | 숫자/고유명사 ("20,000여 레시피", "3인 팀") |
| 많은 | 수치 ("MAU 2만", "1,000개 마커") |
| 열심히 | 기간·횟수 ("3년간 꾸준히", "PR 3회") |
| 최선을 다해 | 구체 행동 ("워터폴을 직접 레코딩해") |
| 큰 성과 | 측정값 ("FCP 70% 단축", "20배 단축") |

### Reduce English Density
Korean HR readers and ATS alike penalize answers that feel like English tech manuals translated on-the-fly. English tokens also **eat character budget** — the 1,000자 limit is tight.

**Rules:**
- First occurrence of a critical brand/tool: keep English (`Next.js`, `FCP`, `ISR`, `BFF`, `DevTools`). Subsequent mentions: drop the English or use Korean.
  - `Chrome DevTools Performance 워터폴` → 다음 문단부터는 `워터폴`
  - `Lighthouse CI` → `라이트하우스 CI` 또는 `CI`
- Terms the general reader knows in Korean: use Korean.
  - `WebView` → `웹뷰` · `iOS/Android` → `앱 스토어` · `Google Maps` → `구글 지도`
- Protocol/metric names that carry specific meaning: keep (FCP, LCP, ISR, SSR, CSR, PR, API).
- Version numbers: drop unless load-bearing. `Next.js 15 App Router` → `Next.js`.

### Score-Based Self-Assessment (점수화 문항 대응)
Some companies ask to rate yourself on 100. **Never pick 100.** Korean HR prefers **65~85점** with a specific gap explanation.
- Below 60: reads as low confidence / low qualification
- 90+ : reads as arrogant / self-unaware
- **Sweet spot: 70~80.** State what the remaining points represent (a concrete gap) and how you'll close them at the company.

Example: `75점. 프론트·네트워크 병목은 자신 있게 찾지만, 자바·파이썬 서버 튜닝이나 DB 쿼리 분석은 실무 경험이 부족해 학습 중입니다. 남은 25점은 샘표 현장에서 채우겠습니다.`

### 입사 후 포부 (when applicable)
If the prompt asks about aspirations/career plan, use **3-phase roadmap** (단기/중기/장기):
- **단기 (1~3년차):** 도메인 학습, 기존 시스템 안정화 기여
- **중기 (3~5년차):** 구축 프로젝트 주도, 공통 기능/방법론 제안
- **장기 (5년차+):** 기업 비전에 맞춘 전문가 포지션

Tie each phase to the company's actual initiatives (read 채용공고, 인재상, 최근 IR).

### Company Research Hooks
Before writing, extract 3 things from the company:
1. **Vision/tagline** (e.g., 샘표 "우리맛의 가치를 알리고 세계인을 즐겁게") — quote once in 지원동기.
2. **인재상 keyword** (e.g., 샘표 "겸손하지만 열정이 넘치는") — let self-assessment tone echo it (humble score + specific effort).
3. **직무 description 키워드** (e.g., "요구분석·설계·개발·테스트·론칭") — use these exact words as subtitle or paragraph anchors.

### STAR Skeleton for Each Answer
- **S (Situation):** 1~2 sentences. What was broken, what the scale was.
- **T (Task):** 1 sentence. What you owned.
- **A (Action):** 2~4 sentences. **Specific** actions, tool names, decisions — including the path not taken and why ("라이브러리를 교체하는 대신 원인을 추적했습니다").
- **R (Result):** 1~2 sentences. **Measured** — numbers, timeframe, external validation (PR merge, 수상, 사용자 피드백).

### Example (Good Jasoseo Opening)
```
[레시피 플랫폼에서 샘표의 과제를 봤습니다]

MAU 2만의 레시피 플랫폼 레시피오에서 프론트엔드 1인으로 1년간 개발하며,
사용자가 매일 먹을 것을 고르는 서비스의 무게를 체감했습니다. 20,000여
레시피 페이지를 서빙하면서 페이지 속도, 데이터 정합성, 검색 경험이
콘텐츠만큼 중요하다는 것을 배웠습니다.

샘표는 "우리맛의 가치를 알리고 세계인을 즐겁게 한다"는 비전 아래,
우리맛연구중심과 디지털 채널을 통해 레시피·커머스·커뮤니티를
넓혀가고 있습니다.
```

### Character Count Workflow
Korean online forms count **with spaces**. Always verify before submitting:
```bash
python -c "import re; text=open('file.md', encoding='utf-8').read(); print(f'with-space: {len(text)} / no-space: {len(re.sub(r\"\s\", \"\", text))}')"
```
Target each answer to land at **90~98%** of the cap. Leaving more than 10% empty signals the writer ran out of material.

### Multi-Question Diversification (다문항 각도 분리)
When a 자소서 has 3+ questions, each must show a **different face** of the applicant. Reusing the same episode three times in three different wordings reads thin and signals a shallow experience pool — even if each answer is individually well-written.

**Template (3-question conglomerate pattern):**
- **Q1 (지원동기 / 선택이유):** *direction & motivation* — philosophy, domain connection, "why you, why here, why now"
- **Q2 (대표 경험):** *technical/project depth* — one project's design decisions (decision → rationale → outcome), not a resume-list
- **Q3 (핵심 역량 + 점수 + 노력):** *growth method* — how you became good at this, which habits and learning loops built the capability

Each question answers a different reader question. Don't answer "what I achieved" three times.

**Symptom of failure:** overlap matrix. Lay out your core episodes (e.g., FCP optimization, open-source PR, algorithm years) as rows and the 3 questions as columns. If 3+ episodes show ✓ in 2+ columns, redistribute.

### Episode Role Separation (에피소드 역할 분리)
If the same episode must appear in multiple questions (often unavoidable when one flagship project covers most of your story), assign it **different narrative roles**:

- **Example role (한 줄 예시):** one sentence, used as evidence for a broader claim
- **Deep-dive role (본론):** 2~5 sentences with numbers, decisions, edge cases, and external validation

**Rule:** each episode gets exactly **one deep-dive slot**. All other appearances must stay at the example-role level.

**Good:**
- Q1: "외부 라이브러리에 문제가 있을 때 교체하지 않고 원인을 추적해 오픈소스 공식 레포에 PR로 제출합니다." *(한 줄 예시)*
- Q3 [1]: 마커 클러스터 PR의 원인 분석 → 알고리즘 전환 → 20배 단축 → 메인테이너 리뷰까지 풀 전개 *(본론)*

**Bad:**
- Q1: 마커 클러스터 24.68ms→1.23ms, 20배 단축, 메인테이너 리뷰 *(본론 수준)*
- Q3: 마커 클러스터 24.68ms→1.23ms, 20배 단축, 메인테이너 리뷰 *(또 본론 수준)*

### Abstract-Term Redefinition (추상 키워드 재정의)
Corporate 인재상 keywords (겸손, 열정, 도전, 혁신, 소통) are worn out by millions of 자소서. Quoting them verbatim signals laziness. **Redefine them in your own words** at the opening of the paragraph that uses them.

**Worn out:**
```
[겸손한 자세로 임하겠습니다]
겸손합니다. 저는 항상 배우는 자세로...
```

**Redefined:**
```
[겸손하지만 물러서지 않는 방식]
겸손은 "내가 안다"를 먼저 의심하는 일이라 배웠습니다.
속도 점수만 보고 고쳤다면 FCP는 그대로였을 것입니다...
```

Pattern: `[키워드]은(는) ~[본인의 구체 정의]~라 배웠습니다.` as the paragraph opener, followed by an episode that enacts the definition. The redefinition converts a cliché into your thesis.

### Subtitle-Body Coherence Audit (소제목-본문 매칭)
A subtitle is a promise. The body must deliver on the subtitle's exact keywords.

**Audit procedure:**
1. Extract the 1~2 anchor keywords from each subtitle (e.g., "겸손", "물러서지 않음").
2. Search the body for those keywords. They should appear in the **opening sentence** of the paragraph, not buried in a tailing line.
3. If a keyword appears only in the subtitle and never (or only weakly) in the body, the promise is broken — the paragraph is about something else than what the subtitle advertises.

**Common failure:** subtitle `[겸손하지만 물러서지 않는 방식]` → body is actually about measurement methodology, with "겸손" only showing up as a tail afterthought. Fix via Abstract-Term Redefinition at the paragraph opener.

**Two-keyword subtitles (e.g., "겸손하지만 물러서지 않음")** require two paragraphs — one per keyword — each opened by its own keyword. Never collapse them into one paragraph.

### Number Consistency Across Questions (수치 정합성)
When editing a scale metric (MAU, DAU, page count, 수상 이력, 팀 규모) in any one question, grep the entire document and update **every** occurrence. A single mismatch — "MAU 3만" in Q1 vs "MAU 2만" in Q2 — signals sloppiness and undermines every other number on the page.

Pre-submission check:
```bash
grep -nE "MAU|DAU|[0-9]+만|[0-9]+,[0-9]+" file.md
```
All scale numbers referring to the same thing should be identical across every question.

### Tense Alignment (시제 정합성)
Korean 자소서 mixes 과거 완결형 (~했습니다) and 현재/미래형 (~합니다, ~하겠습니다). These must **flow into each other** within a paragraph and between paragraphs.

- **Narrative (과거 완결):** `분석했습니다 → 설계했습니다 → 달성했습니다` ✓ internally consistent
- **Principle/habit (현재):** `측정합니다 → 추적합니다` + closing promise `기여하겠습니다` ✓ internally consistent
- **Broken:** `항상 물러서지 않았습니다. ... 멈추지 않겠습니다.` — past-definitive ("안 물러섰다 = I didn't retreat") into future-promise ("멈추지 않겠다 = I won't stop"). The past-definitive closes the habit in the past; the future-promise demands an open-ended present habit. Discontinuous.
- **Fix:** `항상 물러서지 않습니다. ... 멈추지 않겠습니다.` — present-habitual ("안 물러선다 = I don't retreat") flows naturally into future-promise.

**Rule of thumb:** if a paragraph ends in a future-promise (~겠습니다), the preceding principle sentences should be present-habitual (~합니다), not past-definitive (~했습니다).

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

### Jasoseo-Specific Correction Checklist

Run these **in addition** to the general checks when in Jasoseo mode:

1. **진부어 8대악 grep.** Search for 성실/노력/책임감/솔선수범/창의적/도전적/열정/꼼꼼 and replace with actions or numbers.
2. **당사/귀사/이 회사 → 기업명.** Even one occurrence is a red flag.
3. **1인칭 주어 count.** If "저는/제가/저의" appears more than 2~3 times per 1000자, drop the subject.
4. **Hedge cleanup.** Grep for 아마도/~수도/~같습니다/~하려고/~하고 싶습니다 and convert to declarative.
5. **Bracketed subtitle audit.** Each subtitle under 30자, no slogans/proverbs, prefer "How + Result" format.
6. **Keyword match against JD.** Paste the job description next to your draft; JD keywords should appear verbatim in subtitles or first sentence of each section.
7. **인재상 echo.** The company's 인재상 words should be **implicitly** reflected in tone (e.g., "겸손" → self-score under 80). Don't quote the 인재상 verbatim — that's lazy.
8. **Character count ≤ 1000 with spaces.** Verify with the Python one-liner. Trim English first before cutting content.
9. **No emoji, no icons.** Korean HR forms strip them, and they read as unprofessional in formal applications.
10. **First-paragraph test.** Read only the first paragraph of each answer. Does it already communicate the core answer? If no, rewrite to 두괄식.
11. **Overlap matrix.** List core episodes as rows, question numbers as columns. Mark ✓ where each episode appears. If any episode is ✓ in 2+ columns at the same depth, apply Episode Role Separation — demote all but one to one-liner examples.
12. **Subtitle-body keyword grep.** For each `[subtitle]`, extract its anchor keyword(s) and confirm they appear in the opening sentence of the body, not buried in a tail line.
13. **Number consistency sweep.** `grep -nE "MAU\|DAU\|[0-9]+만"` the whole document — all same-metric occurrences must match.
14. **Tense continuity check.** Read each paragraph's last sentence and the next paragraph's first sentence as a pair. Past-definitive (~했습니다) should not immediately precede future-promise (~겠습니다) across paragraphs without a present-habitual (~합니다) bridge.
