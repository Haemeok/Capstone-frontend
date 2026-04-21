# Auth Contract

> This is the authoritative specification of authentication behavior in this project.
> Any code change that violates a row in the tables below must update this document in the same PR.
> Row violations are enforced by `src/shared/api/__tests__/auth-contract.test.ts`.

## Why this exists

Auth logic is spread across `apiClient`, `auth.ts`, `handle401Error`, `useAuthManager`, `AppStateInitializer`, `useUserStore`, and `/api/auth/refresh` route. A bug ("anonymous users see a 'session expired' toast on detail pages") has regressed multiple times because each piece is tested in isolation while the contract between them is not. This document defines the contract. The contract test locks it in.

## Session States (equivalence classes)

4 equivalence classes. "State" means (access cookie, refresh cookie, Zustand user) — but the cookies are httpOnly, so from the client's perspective, state is distinguishable only by how the server responds.

| State | Meaning | How to simulate in tests |
|---|---|---|
| ANONYMOUS | 쿠키 없음 — fresh visitor or post-logout. ANONYMOUS_NEVER와 ANONYMOUS_LOGGED_OUT은 계약상 동일 클래스. | mockFetch: 원요청 401 → refresh 401 |
| VALID | 쿠키 유효 — 정상 세션 | mockFetch: 원요청 200 |
| ACCESS_EXPIRED | access만 만료, refresh 유효 | mockFetch: 원요청 401 → refresh 200 → retry 200 |
| BOTH_EXPIRED | access + refresh 둘 다 만료 | mockFetch: 원요청 401 → refresh 401 |

(BOOTSTRAPPING은 별도 관심사 — `AppStateInitializer`에서 `/me`를 호출하는 초기화 플로우. 이 계약은 정상 앱 런타임 중 요청 동작을 정의하며, 초기 부트스트랩은 별도 테스트 대상.)

## Endpoint Kinds

| Kind | Example | 쿠키 없을 때 서버 응답 (가정) |
|---|---|---|
| public | /auth/login, /health | 200 (쿠키 안 봄) |
| optional-auth | /v2/recipes/{id}/status | 401 (또는 200 w/ 공개 필드 only; 클라이언트는 401 케이스도 견뎌야 함) |
| required | /v2/users/me | 401 |

클라이언트는 **라우트 종류로 분기하지 않는다.** 이전 설계는 per-request `silentOn401` 옵션으로 optional-auth 엔드포인트만 silent 처리했지만, 이는 (1) BOTH_EXPIRED 사용자가 optional-auth 호출 시 잘못 silent되고 (2) ANONYMOUS 사용자가 required 호출 시 거짓 토스트가 뜨는 문제가 있었음. 현재 설계는 **서버의 refresh response body 시그널**만으로 분기 — 다음 섹션 참조.

## Refresh Response Discrimination

`/api/auth/refresh` Next route (src/app/api/auth/refresh/route.ts)는 쿠키 상태를 자체 판정해 세 종류 응답을 내려준다:

| 응답 | 조건 | 시그널 (body.error) |
|---|---|---|
| 200 + Set-Cookie | refresh 성공 | (본문 데이터) |
| 401 | **쿠키 없음** (route.ts:37-47에서 차단) | `"No refresh token available"` |
| 401 | 쿠키 있지만 백엔드 만료 (route.ts:84-87) | `"Token refresh failed"` |

클라이언트 `performTokenRefresh`(src/shared/api/auth.ts)는 이 body를 읽어 `RefreshResult`로 분기:

- `success` — response.ok
- `no_session` — 401 + `body.error === "No refresh token available"` → **forceLogout 스킵 (silent)**
- `expired` — 401 + 다른 body → forceLogout 발행
- `network_error` — fetch reject → forceLogout 발행

`refreshToken()` 외부 반환은 boolean(성공/실패) 유지 — `handle401Error` 경로에서 retry 여부만 판정.

**httpOnly 쿠키라 클라이언트 단독으로는 "쿠키 유무"를 알 수 없다.** 서버(Next route)만 확신 가능. 그래서 client-state(Zustand `isAuthenticated`, localStorage 플래그 등)로 판정하는 대신 **서버 응답에 의존**한다. 과거 `16e3348`/`958d6af` 사이클에서 client-state 기반 gate가 drift로 깨졌던 경험의 교훈.

## Contract Matrix (State × Endpoint)

각 셀은 `apiClient(endpoint)` 호출의 post-condition을 정의:
- **forceLogout**: `forceLogout` 커스텀 이벤트 발행 여부 (= "로그인 만료" 토스트 표시)
- **refreshCalls**: `/api/auth/refresh` 호출 횟수
- **retry**: 원요청 재시도 여부
- **result**: apiClient가 반환하는 값 또는 throw하는 에러

라우트는 토스트 여부를 결정하지 않는다 — "라우트 무관 anonymous silent" 정책. 분기는 refresh response body 시그널로 이루어짐 (상단 섹션 참조).

| State | public | optional-auth | required |
|---|---|---|---|
| ANONYMOUS | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=**NO**, refresh=1 (401 + no_session), retry=NO, result=throw ApiError(401) | forceLogout=**NO**, refresh=1 (401 + no_session), retry=NO, result=throw ApiError(401) |
| VALID | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=NO, refresh=0, retry=NO, result=data |
| ACCESS_EXPIRED | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=NO, refresh=1 (200), retry=YES, result=data | forceLogout=NO, refresh=1 (200), retry=YES, result=data |
| BOTH_EXPIRED | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=**YES**, refresh=1 (401 + expired), retry=NO, result=throw ApiError(401) | forceLogout=**YES**, refresh=1 (401 + expired), retry=NO, result=throw ApiError(401) |

**핵심 행 (버그 재발 감시):**
- **ANONYMOUS × required → forceLogout NO** (이게 이 계약 도입의 직접 동기. 한 번도 로그인 안 한 사용자는 required 페이지에 진입해도 "로그인 만료" 토스트 안 뜸).
- **BOTH_EXPIRED × optional-auth → forceLogout YES** (진짜 만료된 사용자는 어떤 라우트든 토스트 뜸. 이전 silentOn401 설계에서 잘못 silent 처리되던 행).
- ANONYMOUS × 모든 엔드포인트 → forceLogout NO는 **refresh response body의 "No refresh token available" 시그널**에 의존. Next route가 이 시그널을 바꾸면 전 행이 깨진다.

## Concurrency / Timing Contract

| Scenario | Expected |
|---|---|
| C1: 두 요청이 거의 동시에 401 → 각자 handle401Error 진입 | `/api/auth/refresh`는 **1번만** 호출 (dedup). 두 요청 모두 refresh 결과에 따라 retry. |
| C2: refresh 실패 직후 (5초 cooldown 내) 또 다른 401 요청 | refresh는 **호출 안 됨** (cooldown). forceLogout은 **재발행 안 됨** (이미 첫 실패 때 발행). |
| C3: cooldown 만료 후 401 요청 | refresh 다시 호출됨. |

## Edge Cases

| Scenario | Expected |
|---|---|
| E1: refresh 200 성공 → retry 요청이 401 (계정 정지/권한 변경) | apiClient는 ApiError(401) throw. **forceLogout은 발행하지 않음** (refresh 자체는 성공했음). |
| E2: refresh fetch가 네트워크 에러 (reject) | `RefreshResult = "network_error"` → expired와 동일 취급. forceLogout 발행. |

## State Mutations (Zustand)

계약에서 Zustand `useUserStore` 변화는 **최소한**만 포함:
- `performLogout` 성공 시: user=null, isAuthenticated=false (기존 `logoutAction`)
- `forceLogout` 이벤트 수신 시: `useAuthManager`가 `logoutAction` 호출 → user=null

이 외 시점(리프레시 성공 등)에는 store를 직접 건드리지 않는다. 유효 세션의 user는 `/me` 쿼리 결과로 hydration된 상태가 유지된다.

## Regression Lock (이 파일 바꾸면 어느 테스트가 깨진다)

`src/shared/api/__tests__/auth-contract.test.ts` 기준. 코드 변경이 계약을 위반하면 나열된 `it`가 실패한다.

### 전체 매트릭스 (`Auth Contract: State × Endpoint matrix`)

12 rows. 각 row가 `"$state × $endpoint > contract: forceLogout=..., refresh=..., retry=..., result=..."` 이름으로 실행됨. 매트릭스의 어떤 셀이 깨지든 이 describe 블록에서 노출된다. 추가로 `"명세 문서와 row 개수가 일치한다 (명세 누락 방지)"` 테스트가 row 개수가 12에서 벗어나면 즉시 실패한다.

### 주요 회귀 시나리오 → 실패하는 it

| 코드 변경 | 실패하는 `it` |
|---|---|
| `performTokenRefresh`가 body 시그널 분기를 버리고 단순 boolean으로 되돌아감 | ANONYMOUS 행 전체 (`ANONYMOUS × public/optional-auth/required`), `Route-agnostic anonymous silence > 익명 사용자가 required 라우트...`, `Route-agnostic anonymous silence > 익명 사용자가 optional-auth 라우트...`, `getRecipeStatus는 익명 사용자에게 forceLogout을 발행하지 않는다`, `getRecipesStatus (배치)도 동일하게 익명에서 toast 없음` |
| `NO_SESSION_ERROR_MESSAGE` 문자열을 Next route 응답과 다르게 바꿈 | 위와 동일 (시그널 매칭 실패 → expired 경로로 빠짐) |
| `refreshToken`이 `no_session` 결과에서 `dispatchForceLogoutEvent`를 호출하도록 되돌림 | 위와 동일 |
| `refreshToken`이 `expired`/`network_error`에서 dispatch를 스킵하도록 변경 | `BOTH_EXPIRED × optional-auth/required`, `Route-agnostic anonymous silence > 진짜 만료 사용자는 어떤 라우트든 forceLogout 발행`, `E2: refresh fetch가 네트워크 에러면 forceLogout을 발행한다` |
| `refreshToken`의 cooldown 분기 제거 | `C2: cooldown 내 재시도 → refresh 호출되지 않고 forceLogout 재발행 없음` |
| `refreshToken`의 dedup (refreshPromise 공유) 제거 | `C1: 두 요청이 동시에 401 → refresh는 1번만 호출된다 (dedup)` |
| `refreshToken`이 cooldown 만료를 인식 못 함 | `C3: cooldown 만료 후 재시도 → refresh 다시 호출된다` |
| `handle401Error`가 refresh 성공 후 retry 에러에서 null 반환 안 함 | `E1: refresh 200 성공 후 retry가 401이면 ApiError 반환하지만 forceLogout은 없다` |
| Next `/api/auth/refresh` route에서 쿠키 없음 판정(line 37-47) 제거 | 백엔드로 요청이 흘러가서 의도치 않은 응답이 올 수 있음 — 하네스가 가정하는 body가 맞지 않게 되어 ANONYMOUS 행 전체 및 route-agnostic 테스트 실패 가능 |

### 매트릭스에 row 추가 시 업데이트해야 할 곳

1. 이 문서의 Contract Matrix 표
2. `src/shared/api/__tests__/auth-contract.test.ts`의 `CONTRACT` 배열
3. `"명세 문서와 row 개수가 일치한다"` 테스트의 `toHaveLength(n)` 값
4. 이 Regression Lock 표의 해당 시나리오 반영

누락 시 `"명세 문서와 row 개수가 일치한다"` 단일 테스트가 곧바로 실패하여 drift를 막는다.

## Out of scope (이 계약이 다루지 않는 것)

- `AppStateInitializer` 초기 부트스트랩 (앱 로드 시 `/me` 호출 순서). 별도 테스트.
- OAuth 콜백 라우트 (`/api/auth/callback/*`).
- WebSocket 인증 (`/ws/*`).
- CSRF 토큰.
- 다중 탭 동기화.
