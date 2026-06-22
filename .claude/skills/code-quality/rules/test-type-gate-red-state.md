---
title: 음수 타입 테스트(`@ts-expect-error`)는 red-state를 먼저 확인한다 — tsc가 오라클, jest 아님
prefix: test
trigger: 타입 좁힘·제네릭 제약·discriminated union을 "잘못된 값은 컴파일 에러"로 보장하려고 `@ts-expect-error`나 타입 단언으로 테스트를 만들 때. 예: `lang`을 `string`→`Locale`로 좁히고 `lang:"EN"`이 거부되는지 검증.
---

## Symptom

타입을 좁혔다고 믿고 `@ts-expect-error`로 "타입 테스트"를 만들었는데, 둘 중 하나가 일어난다: (1) 타입이 실제로는 안 좁혀졌는데도 테스트가 통과해 **false-pass**, 또는 (2) 파일명이 `*.test.ts`라 jest가 그 파일을 **런타임 실행**해버려(타입 검증이 아니라 실제 호출) 의도와 다르게 동작.

```ts
// MyApi.test.ts — jest가 이 파일을 런타임 실행한다
// @ts-expect-error lang must be Locale
api.get("/x", { lang: "EN" }); // 타입이 안 좁혀졌으면 에러가 안 나고, jest는 타입을 안 봄 → 항상 "통과"
```

## Root cause

**jest는 타입을 검증하지 않는다.** ts-jest/babel은 transpile-only로 타입을 지운다. 그래서 `*.test.ts`에 넣은 `@ts-expect-error`는 jest 실행 기준 의미가 없고, 그 파일은 그냥 런타임 코드로 실행된다. 타입 단언의 오라클은 **`tsc --noEmit`뿐**이다.

그리고 `@ts-expect-error`는 **바로 다음 줄에 타입 에러가 있을 때만** 유효하다. 타입이 안 좁혀져 에러가 안 나면 tsc는 `Unused '@ts-expect-error' directive`로 **실패**한다. 즉 "게이트가 비어있는 상태 = tsc 실패"가 곧 이 테스트의 red-state다. tsc를 안 돌리면 게이트가 비었는지 채워졌는지 알 수 없다.

## Recommended pattern

음수 타입 테스트도 런타임 TDD처럼 **red → green**을 눈으로 확인한다.

**Incorrect — `*.test.ts` + jest만 신뢰:**

```ts
// Component.test.ts
// @ts-expect-error
doThing({ kind: "bogus" }); // jest 통과 → 아무것도 증명 못 함
```

**Correct — `.type-test.ts`(jest 제외) + tsc 오라클 + red 확인:**

```ts
// Component.type-test.ts  ← jest testMatch "*.test.*"에 안 걸림, tsconfig include엔 들어감
import { doThing } from "./Component";

export function _typeGate() {
  // 절대 호출 안 됨 → 런타임 부작용 0
  // @ts-expect-error kind must be a valid Variant
  doThing({ kind: "bogus" });
  doThing({ kind: "valid" }); // 유효값은 에러 없이 통과해야 함
}
```

절차:

1. 타입을 좁히기 **전** `tsc --noEmit` → `Unused '@ts-expect-error' directive`로 **FAIL**(= red, 게이트가 비었다는 증거).
2. 타입을 좁힌 **후** `tsc --noEmit` → 에러 0(= green, 디렉티브가 실제 에러를 잡고 있음).

Key points:

- **파일명을 jest 글롭 밖으로.** `.type-test.ts`/`.type-spec.ts` 등 `*.test.*`·`*.spec.*`에 안 걸리는 이름. 안 그러면 jest가 런타임 실행한다. 단 tsconfig `include`엔 들어가야 tsc가 본다.
- **호출을 never-invoked 함수로 감싼다.** import 시점 부작용·실제 네트워크 호출 방지.
- **red를 반드시 본다.** `@ts-expect-error`가 에러 없는 줄 위에 있으면 false-pass처럼 보이지만, tsc는 unused로 잡는다 — 그 FAIL이 정상 red-state다. tsc 안 돌리고 넘기면 게이트는 장식이다.
- 유효값 한 줄(`doThing({kind:"valid"})`)도 같이 둬서 "좁힘이 과하지 않은지"(정상값을 거부하지 않는지)까지 고정한다.
- 이건 linter/컴파일러를 오라클로 쓰는 패턴(planning의 linter-as-oracle 인접). 런타임 동작은 별도 `*.test.ts`가 소유한다 — 음수 타입 테스트는 타입 계약만.
