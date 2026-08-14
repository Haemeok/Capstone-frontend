# 기술 글의 서사 구조

긴 기술 글의 구조를 설계하거나 교정할 때 읽습니다. AI 문체를 피하는 것에 그치지 않고, 글의 결론·실패 과정·전환점·근거가 독자를 설득하도록 배열하는 패턴입니다.

## 목차

- [Destination First](#1-destination-first)
- [Failed Approaches as Narrative Fuel](#2-failed-approaches-as-narrative-fuel)
- [The Mid-Article Pivot](#3-the-mid-article-pivot-problem-reframing)
- [Decision Justification with Why Not Table](#4-decision-justification-with-why-not-table)
- [Metrics Always in Pairs](#5-metrics-always-in-pairs)
- [Natural Language Rule to Implementation](#6-natural-language-rule--implementation)
- [Extended Metaphor as Structural Glue](#7-extended-metaphor-as-structural-glue)
- [Anchor Abstractions with Concrete Scenes](#8-anchor-abstractions-with-concrete-scenes)

Beyond avoiding AI patterns and applying human voice, these structural patterns determine whether an article is _compelling_ or merely _correct_. Extracted from analyzing the narrative architecture of 3 published Korean tech articles.

## 1. Destination First

Reveal the key outcome early — in the introduction or within the first 3 paragraphs. Don't save the "big reveal" for the end. Readers stay engaged when they know the destination and want to learn the route.

```
✅ 결과부터 말하면: 로그 지연 수분~수시간 → 20초 이내, 비용 85.6% 절감. 어떻게 이런 결과를 만들었을까요?
❌ [10 paragraphs of journey] ... 그래서 최종적으로 85.6% 절감이라는 결과를 얻었습니다.
```

## 2. Failed Approaches as Narrative Fuel

Before presenting the final solution, describe 2-3 approaches that were tried and fell short. This isn't filler — it's what makes the chosen solution feel _earned_. Each failed approach should explain WHY it failed, building the constraints that shaped the final answer.

```
✅ 첫 번째 시도 — 코드 리뷰에서 잡자. (...) 문제는 리뷰어의 부담이 비례해서 커진다는 점이었습니다.
   두 번째 시도 — AI에게 규칙 문서를 읽어주자. (...) 대부분은 따랐지만, "대부분"이 문제였습니다.
```

## 3. The Mid-Article Pivot (Problem Reframing)

The strongest articles have a moment where the _problem itself is reframed_, not just the solution. This is the emotional peak — the insight that changes the direction.

```
✅ "그래서 시선을 바꿨어요. 어떻게 LLM이 최적을 뽑게 할지가 아니라, 애초에 어떤 카테고리를 LLM에게 쥐어줄지를 설계하는 방향으로."
✅ "문제는 쿼리가 느린 게 아니라, 한 화면이 쿼리를 30번 던지는 구조였습니다."
```

## 4. Decision Justification with "Why Not" Table

When presenting a technology choice, show ALL candidates with specific reasons each was rejected. Don't just list the winner's features — explain why losers lost.

```
✅ | 솔루션 | 강점 | 우리에게 맞지 않았던 이유 |
   | OpenSearch | 전문 검색에 강함 | 비용이 높고, 대용량 집계가 느림 |
   | Loki | 저비용 | 복잡한 쿼리 불가, 집계 약함 |
   | ClickHouse ✓ | 고속 집계, 압축률 우수 | 전문 검색은 약하지만 우리 패턴의 90%가 필드 조건 검색 |
```

## 5. Metrics Always in Pairs

Never present a number alone. Every metric needs a baseline, comparison, or competing dimension.

```
✅ FCP 6.9초 → 2.04초 (70% 단축)
✅ 무효화 범위: 전체 6개 → 관련 3~4개
❌ FCP를 2.04초로 개선했습니다 (baseline 없음)
❌ 정확도 87% 달성 (이전 대비? 다른 모델 대비?)
```

## 6. Natural Language Rule → Implementation

For each technical decision, first state it as a one-sentence human-readable principle, then show the implementation. This makes code meaningful instead of just present.

```
✅ "BFF든 Server Action이든, 같은 이벤트에는 같은 태그가 무효화되어야 한다."
   → getTagsToInvalidate(event) 정책 함수로 중앙화

✅ "Repository가 Controller를 참조하면 안 된다."
   → ArchUnit layeredArchitecture() 테스트
```

## 7. Extended Metaphor as Structural Glue

Choose one central metaphor and thread it through section headers and transitions. This creates narrative cohesion for long technical articles.

```
✅ 마이그레이션을 "이사"로 → 섹션 제목: "짐 싸기", "트럭 부르기", "새 집에 배치하기", "빈 집 청소"
✅ 카카오: "호그와트 도서관" → 프로젝트 이름 자체가 메타포
```

## 8. Anchor Abstractions with Concrete Scenes

Start abstract concepts with a specific, visualizable moment — a code review scene, an error message, a user complaint, a Slack message.

```
✅ "어느 날 코드 리뷰를 하다가 익숙한 장면을 마주했습니다. Repository 클래스가 Controller를 직접 참조하고 있었습니다."
❌ "아키텍처 규칙 준수는 코드 품질에 중요한 요소입니다."
```

