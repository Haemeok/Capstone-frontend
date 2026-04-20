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

| Kind | Example | 쿠키 없을 때 서버 응답 (가정) | silentOn401 |
|---|---|---|---|
| public | /auth/login, /health | 200 (쿠키 안 봄) | N/A (401 안 남) |
| optional-auth | /v2/recipes/{id}/status | 401 (또는 200 w/ 공개 필드 only; 클라이언트는 401 케이스도 견뎌야 함) | **true** |
| required | /v2/users/me | 401 | false (기본) |

## Contract Matrix (State × Endpoint)

각 셀은 `apiClient(endpoint, options)` 호출의 post-condition을 정의:
- **forceLogout**: `forceLogout` 커스텀 이벤트 발행 여부 (= "로그인 만료" 토스트 표시)
- **refreshCalls**: `/api/auth/refresh` 호출 횟수
- **retry**: 원요청 재시도 여부
- **result**: apiClient가 반환하는 값 또는 throw하는 에러

| State | public | optional-auth (silentOn401=true) | required (silentOn401=false) |
|---|---|---|---|
| ANONYMOUS | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=**NO**, refresh=1 (401), retry=NO, result=throw ApiError(401) | forceLogout=**YES**, refresh=1 (401), retry=NO, result=throw ApiError(401) |
| VALID | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=NO, refresh=0, retry=NO, result=data |
| ACCESS_EXPIRED | forceLogout=NO, refresh=0, retry=NO, result=data (public은 쿠키 무관) | forceLogout=NO, refresh=1 (200), retry=YES, result=data | forceLogout=NO, refresh=1 (200), retry=YES, result=data |
| BOTH_EXPIRED | forceLogout=NO, refresh=0, retry=NO, result=data | forceLogout=**NO**, refresh=1 (401), retry=NO, result=throw ApiError(401) | forceLogout=**YES**, refresh=1 (401), retry=NO, result=throw ApiError(401) |

**핵심 행 (버그 재발 감시):**
- ANONYMOUS × optional-auth → forceLogout **NO**. 이걸 YES로 바꾸는 코드 변경은 계약 위반.
- BOTH_EXPIRED × optional-auth → forceLogout **NO**. 동일.
- 반대로 required 엔드포인트의 anonymous/both-expired는 여전히 forceLogout=YES. 이건 의도된 현재 동작. **알려진 UX 한계**: "한 번도 로그인 안 한 사용자가 required 페이지에 진입하면 토스트"는 이 계약 위에서는 그대로. 개선하려면 이 행을 바꾸고 테스트도 같이 수정 필요.

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
| E2: refresh 요청이 네트워크 에러 (reject) | refresh 실패로 간주. 나머지는 "refresh 401"과 동일 — silent이면 no toast, 아니면 toast. |

## State Mutations (Zustand)

계약에서 Zustand `useUserStore` 변화는 **최소한**만 포함:
- `performLogout` 성공 시: user=null, isAuthenticated=false (기존 `logoutAction`)
- `forceLogout` 이벤트 수신 시: `useAuthManager`가 `logoutAction` 호출 → user=null

이 외 시점(리프레시 성공 등)에는 store를 직접 건드리지 않는다. 유효 세션의 user는 `/me` 쿼리 결과로 hydration된 상태가 유지된다.

## Regression Lock (이 파일 바꾸면 어느 테스트가 깨진다)

코드 변경이 이 계약을 위반하면 `auth-contract.test.ts`가 빨간불로 변한다. 주요 매핑:

| 코드 변경 | 깨지는 행 |
|---|---|
| `performTokenRefresh`의 catch에서 `dispatchForceLogoutEvent` 호출 복원 | ANONYMOUS × optional-auth, BOTH_EXPIRED × optional-auth (2 row + edge E2) |
| `apiClient`가 `silentOn401`을 `handle401Error`에 전달하지 않음 | optional-auth 열 전체 (4 row) |
| `getRecipeStatus`에서 `silentOn401: true` 제거 | getRecipeStatus end-to-end 전용 테스트 |
| `refreshToken`의 cooldown 분기 제거 | C2 |
| `refreshToken`의 dedup(refreshPromise 공유) 제거 | C1 |
| `useUserStore.logoutAction`에서 `user=null` 제거 | Zustand 단위 테스트 (별도) |

이 표는 Task 9에서 실제 it 이름으로 업데이트될 예정.

## Out of scope (이 계약이 다루지 않는 것)

- `AppStateInitializer` 초기 부트스트랩 (앱 로드 시 `/me` 호출 순서). 별도 테스트.
- OAuth 콜백 라우트 (`/api/auth/callback/*`).
- WebSocket 인증 (`/ws/*`).
- CSRF 토큰.
- 다중 탭 동기화.
