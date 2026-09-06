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
기본 검증은 다음 두 가지입니다. 이것만으로 페이지 전체의 번역 완료를 선언하지 않습니다:

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
expect(screen.queryByText(taxonomyMessages.ko.sort["popularityScore,DESC"])).not.toBeInTheDocument();

// (SENTINEL) 더 강함 — 테스트에서 사전에 표식값 주입 후 그 표식이 렌더되는지.
//   카피와 완전히 분리. YoutubeImportHero.i18n.test.tsx 참고.
expect(screen.getByText(SENTINEL.heroTitle)).toBeInTheDocument();
```

하나의 사전 연결 경로는 대표 테스트로 확인합니다. 독립적인 조건부 UI, 검증 메시지,
언어 전환, fetch·href 연결은 각각의 실패 가능성에 맞춰 추가 검증합니다.
번역 문구를 키마다 복사해 단언하지 않습니다. ko 부재 단언은 두 로케일의 기대 문구가
실제로 다를 때만 사용합니다. 동일한 고유명사까지 부정하면 정상 UI도 실패합니다.

## Anti-pattern

```tsx
// ja/en 번역 리터럴을 직접 박음 → 카피 수정 시 깨지는 부채
expect(screen.getByText("材料 2")).toBeInTheDocument();
expect(screen.getByText("Start free")).toBeInTheDocument();
// 같은 파일에서 키마다 리터럴 단언 N개 → 사전 재인코딩
```

한국어도 같은 기준을 적용합니다. 변경 가능한 카피는 사전참조/sentinel을 사용합니다.
정확한 문구 자체가 명시적인 요구사항인 경우에만 해당 문구의 소유 테스트에서 리터럴로
검증합니다. 언어가 아니라 요구사항이 예외의 근거입니다.

## Heuristic

- 단언을 보고 물어라: **"PM이 이 번역을 자연스럽게 다듬으면 이 테스트가 깨져야 하나?"** 깨지면 안 되면
  → 리터럴을 사전참조/sentinel로 교체.
- 연결 테스트와 사전 검사는 최소 검사입니다. 완료 판단은
  [렌더 트리의 미추출 문자열 확인](policy-i18n-type-gate-misses-unextracted-strings.md)과
  [라우트 완료 기준](policy-i18n-route-exists-not-localized.md)을 함께 따릅니다.
- 기존 테스트 삭제 여부는 [테스트 검토 절차](test-prune-and-distrust.md)에 따라 판단합니다.
- "ja 카피 정확성"을 컴포넌트 테스트가 책임지지 마라. 그건 PM/사전의 몫이고, 테스트는 사전이
  올바르게 **연결**됐는지만 본다.
