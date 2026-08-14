---
title: i18n 테스트는 와이어링을 검증한다, 번역 카피가 아니라
prefix: test
trigger: Writing a test for a localized component/page where the assertion hardcodes a translated ja/en string (`getByText("作りました")`, `name: "3つ星を選択"`, `toHaveTextContent("Done cooking!")`).
---

## Symptom

로케일 컴포넌트 테스트가 번역된 문자열을 그대로 박아서 단언한다:

```tsx
expect(screen.getByText("作りました")).toBeInTheDocument(); // ja 카피
expect(screen.getByRole("button", { name: "3つ星を選択" })); // ja 카피
expect(btn).toHaveTextContent("おつかれさまでした！🎉"); // ja 카피
```

PM(이 프로젝트는 모국어 PM이 카피를 자주 다듬음, `naming-ubiquitous-language` 인접)이 번역을
자연스럽게 손보면 컴포넌트 동작은 멀쩡한데 테스트가 빨개진다. 이건 사전을 **두 곳**(messages +
테스트)에 적은 것 — 테스트가 버그를 잡는 게 아니라 "사전을 바꿨다"는 사실만 재확인하는
change-detector다 (`test-invariants-not-constants`의 i18n 인스턴스).

## Root cause

i18n 슬라이스의 AC가 보통 "ja에서 라벨이 ja로 보인다"라, 가장 저항 적은 길이 방금 사전에 친
리터럴을 테스트에 복사하는 것. 리터럴이 PR diff에 바로 있어 손이 그리로 간다. 하지만 **번역 카피의
정확성은 테스트의 계약이 아니다** — 그건 PM이 언제든 바꿔도 되는 값이다. 테스트가 지켜야 할 진짜
계약은 두 가지뿐:

1. **와이어링**: 로케일 라우트(`/ja`)면 ja 사전 엔트리가 선택되고 **source-locale(ko) 문자열은
   안 보인다**.
2. **불변식**: ja/en 사전에 미번역 한글 잔재가 없다 (이미 `*NoHangul*` 가드가 담당 — 컴포넌트
   테스트에서 재검증 금지).

## Recommended pattern

리터럴 대신 **사전을 참조**하거나 **sentinel 값을 주입**하고, ko-negative로 분기를 굳힌다.

```tsx
// (B) 사전 참조 — 카피가 바뀌어도 안 깨짐. 와이어링만 검증.
import { taxonomyMessages } from "@/shared/i18n/taxonomyMessages";
expect(
  screen.getByText(taxonomyMessages.ja.sort["popularityScore,DESC"])
).toBeInTheDocument();
expect(screen.queryByText("인기순")).not.toBeInTheDocument(); // ko가 새지 않음(진짜 계약)

// (SENTINEL) 더 강함 — 테스트에서 사전에 표식값 주입 후 그 표식이 렌더되는지.
//   카피와 완전히 분리. YoutubeImportHero.i18n.test.tsx 참고.
expect(screen.getByText(SENTINEL.heroTitle)).toBeInTheDocument();
```

컴포넌트당 **와이어링 테스트 1개**면 충분하다(ja 엔트리 보임 + ko 부재). "ja 카피가 맞나"를
키마다 N번 단언하지 마라 — 그건 사전 스냅샷이지 행동이 아니다.

## Anti-pattern

```tsx
// ja/en 번역 리터럴을 직접 박음 → 카피 수정 시 깨지는 부채
expect(screen.getByText("材料 2")).toBeInTheDocument();
expect(screen.getByText("Start free")).toBeInTheDocument();
// 같은 파일에서 키마다 리터럴 단언 N개 → 사전 재인코딩
```

예외: **source-locale(ko) 리터럴**은 자연스럽다(`getByText("인기순")`) — ko는 카피=원본이라
사전 참조와 같은 값이고, "ko에선 ko가 보인다"는 와이어링의 음성 단언이기도 하다. 깨지는 건 ja/en
번역 리터럴이다. 그것만 골라 없애거나 사전참조/sentinel로 바꾼다.

## Heuristic

- 단언을 보고 물어라: **"PM이 이 번역을 자연스럽게 다듬으면 이 테스트가 깨져야 하나?"** 깨지면 안 되면
  → 리터럴을 사전참조/sentinel로 교체.
- 컴포넌트당 와이어링 1개(ja 보임 + ko 부재) + no-Hangul 가드(사전 레벨)가 i18n의 전체 계약이다.
  나머지 리터럴 단언은 삭제 대상.
- "ja 카피 정확성"을 컴포넌트 테스트가 책임지지 마라. 그건 PM/사전의 몫이고, 테스트는 사전이
  올바르게 **연결**됐는지만 본다.
