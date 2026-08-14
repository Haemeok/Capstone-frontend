# 포트폴리오·블로그 모드

포트폴리오 문서나 기술 블로그를 작성·교정할 때 해당 모드만 읽습니다. 두 모드의 어조, 구조, 규칙, 예시를 구분합니다.

## 목차

- [Portfolio Mode](#portfolio-mode)
  - [Tone](#portfolio-tone)
  - [Structure](#portfolio-structure)
  - [Rules](#portfolio-rules)
  - [Example](#portfolio-example)
- [Blog Mode](#blog-mode)
  - [Tone](#blog-tone)
  - [Structure](#blog-structure)
  - [Rules](#blog-rules)
  - [Voice Calibration](#voice-calibration-선택--블로그-톤-개인화)
  - [Example](#blog-example)

## Portfolio Mode

Use when writing portfolio documents, project descriptions for job applications, or technical accomplishment summaries.

### Portfolio Tone

- **Sentence ending:** ~했습니다, ~이었습니다 (formal declarative)
- **Voice:** Confident, factual, concise
- **No conversational fillers:** Don't use ~거든요, ~해요, ~이에요

### Portfolio Structure

Portfolio docs follow a fixed structure. Keep it but make it read naturally:

- **Problem & Analysis**: What was broken and why (facts only, no solutions here)
- **Key Actions**: What you did and how (the solution, with enough technical detail)
- **Result**: Measurable outcome

### Portfolio Rules

1. **One sentence = one piece of information.** No compound sentences with 3+ clauses.
2. **No parenthetical enumeration.** Don't list items in parentheses: (`jobId`, `status`, `progress`). Use Korean descriptions instead: "작업 상태, 진행률, 결과 ID를 포함한"
3. **Problem section contains ONLY problems.** No solutions, no "we designed X" — that goes in Key Actions.
4. **No redundancy between Problem and Key Actions.** If Problem says "하이브리드 구조로 설계했습니다", Key Actions must not repeat "하이브리드 구조를 설계했습니다".
5. **Numbers over adjectives.** Always prefer "FCP 6.9초 → 2.04초" over "FCP를 대폭 개선".
6. **Max 2-3 code-level terms per section.** Variable names, tag names, enum values — keep to a minimum. The reader is a hiring manager, not a code reviewer.
7. **[해결] [결과] tags are OK** as section markers within Key Actions — they provide scannable structure without the AI-label problem (they're not bolded inline labels).

### Portfolio Example

```
레시피오는 20,000개 이상의 레시피 페이지를 서빙합니다. 초기 CSR 구조에서
FCP 개선과 캐시 이점을 위해 ISR로 전환했지만, FCP는 6.9초로 여전히 느렸습니다.
Chrome DevTools Network Waterfall 분석 결과, 폰트와 이미지가 동시에 로딩되며
대역폭을 경합하는 것이 병목이었습니다.
```

---

## Blog Mode

Use when writing tech blog posts, engineering blog articles, or team retrospectives.

### Blog Tone

- **Sentence ending:** ~해요, ~이에요, ~거든요, ~었어요 (casual conversational)
- **Voice:** Friendly, narrative, sharing-a-story
- **Conversational fillers OK:** ~거든요, ~기도 하고, ~인 거죠

### Blog Structure

Blog posts are free-form but typically follow:

1. Team/author intro + context
2. Problem setup (often with user quotes or data)
3. Solution journey (chronological, including failed attempts)
4. Results and learnings
5. Future plans

### Blog Rules

1. **Tell the journey, not just the conclusion.** Include what you tried first, what failed, what you learned.
2. **Use rhetorical questions** to introduce sections: "그래서 어떻게 해결했을까요?"
3. **Admit failures explicitly.** "직관적으로는 좋아질 것 같았는데, 실제로는 미미했어요."
4. **Metaphors welcome.** "호그와트 도서관", "마이그레이션은 이사" — make complex ideas relatable.
5. **Direct quotes from users/team** add authenticity.
6. **"결과부터 말하면:"** is a great pattern for hooking the reader early.
7. **Tables for data comparisons**, paragraphs for narrative. Never mix.
8. **Code blocks introduced casually:** "실제 설정은 간단해요." then the code.

### Voice Calibration (선택 — 블로그 톤 개인화)

블로그 모드의 고정 톤(`~거든요`, `~이에요`)은 출발선이지 정답이 아니다. 사용자가 과거에 작성한 글이 있으면, **해당 글의 2~3 문단을 톤 기준 샘플로 삼아** 모드 기본값보다 우선시한다.

**작동 방식:**

1. 사용자가 직접 쓴 블로그/노트/메모 2~3 문단을 받는다 (또는 파일 경로).
2. 샘플에서 다음을 추출한다:
   - 평균 문장 길이 (짧고 끊는 편 vs 길게 잇는 편)
   - 자주 쓰는 종결 어미 (`~거든요`/`~죠`/`~네요`/`~더라고요`)
   - 영문 토큰 빈도와 표기 습관 (`Next.js` vs `넥스트`)
   - 반복적으로 나타나는 연결어·접속어 (`그래서`/`근데`/`아무튼`)
   - 1인칭 사용 빈도 (`저는`/`제가` 등장 밀도)
3. 새로 쓰는 글은 이 5개 축에서 **샘플과 같은 위치**에 자리잡도록 작성한다.

샘플이 없으면 모드 기본값으로 진행한다. 샘플이 있는데 무시하고 일반론만 적용하면 결과가 "같은 사람이 쓴 글"로 보이지 않는다.

### Blog Example

```
안녕하세요. 카카오페이증권 DevOps 팀 Sean.baek (션), Lina.a (리나)에요.

2022년 9월에 입사했을 때, 하루에 쌓이는 로그는 약 100GB였어요. 그때는
로깅 시스템이 큰 고민거리가 아니었죠. 그런데 서비스가 빠르게 성장하면서
상황이 달라졌어요. 로그가 폭발적으로 늘어나기 시작한 거예요.
```

