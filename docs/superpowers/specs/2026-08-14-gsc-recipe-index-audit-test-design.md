# GSC 레시피 색인 전수 조사 테스트 설계

설계: `docs/superpowers/specs/2026-08-14-gsc-recipe-index-audit-design.md`

슬라이스: `docs/superpowers/specs/2026-08-14-gsc-recipe-index-audit-slices.md`

## 테스트 경계

사용자가 관찰하는 경계는 `--init`, `--run`, `--summary` 명령이 만든 파일과 콘솔 결과다. 모든 AC는 Node 환경의 임시 데이터 디렉터리에서 명령 처리기를 실행하고 실제 JSON·JSONL 파일을 읽어 검증하는 acceptance 테스트가 소유한다.

외부 sitemap과 GSC는 실제 네트워크를 호출하지 않고 주입한 adapter로 응답한다. 시간, sleep, random도 주입해 최근 24시간 경계와 요청 시작 간격을 실제 대기 없이 검증한다. 이 테스트는 내부 helper의 구현 모양이 아니라 명령 실행 후 남은 파일, 외부 호출 기록, 종료 결과를 검증한다.

- 테스트 파일: `scripts/__tests__/gsc-recipe-index-audit.test.ts`
- 환경: `@jest-environment node`
- 파일 격리: 테스트마다 `fs.mkdtempSync(path.join(os.tmpdir(), "gsc-index-audit-"))`
- 공통 시각: `2026-08-14T12:00:00.000Z`
- 공통 property: `sc-domain:recipio.kr`

## 요구사항 추적 매트릭스

| AC | 시나리오 | 테스트 ID | 소유 레이어 | 위험 |
| --- | --- | --- | --- | --- |
| AC-1.1 | sitemap 네 개의 6행을 초기화하면 중복 제거된 조사 대상 5개와 source별 행 수가 저장된다 | T-01 | acceptance · 명령+파일 | 무결성 |
| AC-1.2 | 같은 URL이 sitemap 0·1에 있으면 조사 대상은 하나이고 `sitemapIndexes`는 `[0, 1]`이다 | T-01 | acceptance · 명령+파일 | 무결성 |
| AC-1.3 | 조사 대상 한 개가 PASS를 받으면 시도·성공 결과가 저장되고 완료 URL 1개가 된다 | T-03 | acceptance · 명령+파일 | 무결성 |
| AC-1.4 | PASS 한 건은 검사 완료 1·색인됨 1로 집계되고 상태 합계가 검사 완료와 같다 | T-03 | acceptance · 명령+파일 | 무결성 |
| AC-1.4 | PASS·NEUTRAL·coverageState 없음이 함께 있어도 최신 성공 결과 기준 합계가 맞는다 | T-05 | acceptance · 명령+파일 | 무결성 |
| AC-1.5 | 저장 데이터에서 요약만 다시 만들면 외부 호출 없이 같은 결과가 나온다 | T-04 | acceptance · 명령+파일 | 무결성 |
| AC-1.6 | 동작이 없거나 두 개면 사용법을 출력하고 파일·외부 상태를 바꾸지 않는다 | T-20 | acceptance · 명령+파일 | 무결성 |
| AC-2.1 | A 완료·B 미완료 상태에서 재개하면 A를 건너뛰고 B만 검사한다 | T-06 | acceptance · 명령+파일 | 무결성 |
| AC-2.2 | 결과 없는 A 시도는 사용량에는 포함되지만 A는 다시 검사 대상이 된다 | T-07 | acceptance · 명령+파일 | 할당량 |
| AC-2.3 | 기존 조사 대상에 다시 초기화하면 원본 bytes가 바뀌지 않는다 | T-02 | acceptance · 명령+파일 | 무결성 |
| AC-2.4 | 재개 시 프로덕션 sitemap이 달라져도 sitemap을 다시 읽지 않고 고정 조사 대상을 쓴다 | T-08 | acceptance · 명령+파일 | 무결성 |
| AC-2.5 | 세 URL이 모두 완료되면 남은 URL 0이고 상태 합계와 전체 고유 URL 수가 같다 | T-09 | acceptance · 명령+파일 | 무결성 |
| AC-3.1 | 즉시 응답하는 세 URL의 요청 시작 시각은 0ms·250ms·500ms다 | T-12 | acceptance · 시간+호출 | 할당량 |
| AC-3.2 | 최근 24시간 시도 1,800개면 검사 호출 0회이고 다음 가능 시각을 출력한다 | T-10 | acceptance · 시간+호출 | 할당량 |
| AC-3.3 | 최근 24시간 시도 1,799개면 정확히 한 번만 검사한 뒤 멈춘다 | T-11 | acceptance · 시간+호출 | 할당량 |
| AC-3.4 | network·500·500 순서로 실패하면 시도 3회와 증가하는 두 backoff만 남고 네 번째 호출은 없다 | T-13 | acceptance · 시간+호출 | 할당량 |
| AC-3.5 | 첫 URL이 429면 해당 결과만 기록하고 두 번째 URL을 호출하지 않는다 | T-14 | acceptance · 명령+파일 | 할당량 |
| AC-4.1 | property 확인이 403이면 Inspection 호출 없이 기존 세 파일을 보존한다 | T-15 | acceptance · 명령+파일 | 보안 |
| AC-4.2 | A가 400이면 재시도 없이 미완료로 남고 B는 이어서 성공한다 | T-16 | acceptance · 명령+파일 | 복구성 |
| AC-4.3 | 빈 sitemap·외부 origin·예약 경로가 들어오면 기존 데이터를 보존하고 GSC를 호출하지 않는다 | T-17 | acceptance · 명령+파일 | 보안·무결성 |
| AC-4.4 | 이벤트 로그 3행이 깨졌으면 파일을 수정하지 않고 3행 오류를 알린다 | T-18 | acceptance · 명령+파일 | 무결성 |
| AC-4.5 | credential·token·Authorization이 오류에 섞여도 생성 파일과 콘솔에서 모두 가려진다 | T-19 | acceptance · 명령+파일 | 보안 |

## 구체 시나리오

### T-01 — sitemap 조사 대상을 중복 제거해 초기화한다

- Given
  - sitemap 0: `recipes/A`, `recipes/B`
  - sitemap 1: `recipes/B`, `recipes/C`
  - sitemap 2: `recipes/D`
  - sitemap 3: `recipes/E`
- When: `--init`을 실행한다.
- Then
  - source 행 수는 `[2, 2, 1, 1]`이다.
  - 전체 행 수는 6, 중복 행 수는 1, 고유 URL 수는 5다.
  - `recipes/B`는 한 번만 저장되고 `sitemapIndexes`는 `[0, 1]`이다.
  - 콘솔에도 같은 세 개수가 표시된다.

### T-02 — 기존 조사 대상을 다시 초기화하지 않는다

- Given: `inventory.json`과 `events.jsonl`에 `audit-original` 조사의 sentinel bytes가 있다.
- When: `--init`을 다시 실행한다.
- Then
  - 명령은 실패 상태로 종료되고 기존 조사 대상이 있다는 메시지를 보여준다.
  - sitemap adapter는 호출되지 않는다.
  - 두 파일의 bytes는 실행 전과 같다.

### T-03 — 첫 PASS 결과를 저장하고 색인됨으로 집계한다

- Given
  - 조사 대상은 `https://www.recipio.kr/recipes/A` 한 개다.
  - property 확인은 성공한다.
  - Inspection은 `status: 200`, `verdict: "PASS"`, `coverageState: "URL is on Google"`을 반환한다.
- When: `--run`을 실행한다.
- Then
  - 같은 `attemptId`를 가진 시도 1행과 성공 결과 1행이 순서대로 저장된다.
  - 요약은 전체 1, 검사 완료 1, 남은 URL 0, 색인됨 1이다.
  - 상태 집계 합계는 1이다.

### T-04 — 외부 호출 없이 요약을 재생성한다

- Given: T-03과 같은 조사 대상과 이벤트가 있고 `summary.json`은 삭제돼 있다.
- When: `--summary`를 실행한다.
- Then
  - sitemap, 인증, property 확인, Inspection adapter 호출 수가 모두 0이다.
  - 재생성된 요약은 검사 완료 1, 남은 URL 0, 색인됨 1이다.

### T-05 — URL별 최신 성공 결과로 상태를 집계한다

- Given
  - 조사 대상은 A·B·C·D 네 개다.
  - A의 최신 성공 결과는 `PASS`다.
  - B의 이전 성공 결과는 `Discovered - currently not indexed`, 최신 성공 결과는 `Crawled - currently not indexed`다.
  - C의 성공 결과에는 `coverageState`가 없다.
  - D에는 `request_error`만 있다.
- When: `--summary`를 실행한다.
- Then
  - 검사 완료는 3, 남은 URL은 1이다.
  - 색인됨 1, `Crawled - currently not indexed` 1, `(coverageState 없음)` 1이다.
  - 이전 B 상태는 집계되지 않고, 상태 합계는 검사 완료 3과 같다.
  - D의 실패는 색인 상태가 아니라 API 실패로 집계된다.

### T-06 — 완료 URL을 건너뛰고 미완료 URL부터 재개한다

- Given: 조사 대상 A·B 중 A에만 성공 결과가 있다.
- When: `--run`을 실행하고 B가 성공한다.
- Then: Inspection 호출 목록은 `[B]`이며 A의 새 시도는 없다.

### T-07 — 결과 없는 시도를 사용량에 포함하고 URL은 다시 검사한다

- Given
  - 조사 대상은 A 한 개다.
  - 한 시간 전 A의 시도 이벤트만 있고 대응 결과는 없다.
- When: `--run`을 실행하고 A가 성공한다.
- Then
  - Inspection 호출 목록은 `[A]`이다.
  - 최근 24시간 시도 수는 기존 1회와 새 1회를 합친 2회다.
  - A는 완료 URL이 된다.

### T-08 — 재개할 때 고정 조사 대상만 사용한다

- Given
  - 고정 조사 대상에는 A가 있다.
  - sitemap adapter를 호출하면 Z를 반환하도록 설정돼 있다.
- When: `--run`을 실행한다.
- Then
  - sitemap adapter 호출 수는 0이다.
  - Inspection 호출 목록은 `[A]`이며 Z는 조사하지 않는다.

### T-09 — 전체 조사가 완료되면 모든 개수가 닫힌다

- Given
  - 조사 대상은 A·B·C 세 개다.
  - 최신 성공 결과는 각각 PASS, `Discovered - currently not indexed`, `Crawled - currently not indexed`다.
- When: `--summary`를 실행한다.
- Then
  - 전체 3, 검사 완료 3, 남은 URL 0이다.
  - 색인됨 1과 두 `coverageState` 각 1의 합은 3이다.

### T-10 — 최근 24시간 시도 1,800회에서 새 호출을 막는다

- Given
  - 현재 시각은 `2026-08-14T12:00:00.000Z`다.
  - `2026-08-13T13:00:00.000Z`에 기록된 시도 1,800개가 있다.
  - 조사 대상 A는 미완료다.
- When: `--run`을 실행한다.
- Then
  - Inspection 호출 수는 0이다.
  - 남은 호출 여유는 0이다.
  - 다음 실행 가능 시각은 `2026-08-14T13:00:00.000Z`로 표시된다.

### T-11 — 최근 24시간 시도 1,799회에서 한 번만 호출한다

- Given
  - 최근 24시간 시도 1,799개가 있다.
  - 조사 대상 A·B는 모두 미완료다.
- When: `--run`을 실행하고 A가 성공한다.
- Then
  - Inspection 호출 목록은 `[A]`이고 B는 호출하지 않는다.
  - 최근 24시간 시도 수는 1,800회가 된다.

### T-12 — 모든 요청 시작 사이에 250ms를 둔다

- Given
  - 조사 대상 A·B·C는 모두 미완료다.
  - Inspection은 지연 없이 성공한다.
  - fake clock은 `0ms`에서 시작하고 sleep만큼 전진한다.
- When: `--run`을 실행한다.
- Then: Inspection 요청 시작 시각은 `[0ms, 250ms, 500ms]`다.

### T-13 — 재시도를 별도 시도로 기록하고 두 번에서 끝낸다

- Given
  - 조사 대상은 A 한 개다.
  - Inspection은 차례로 network 오류, 500, 500을 반환한다.
  - base backoff는 1,000ms·2,000ms이고 deterministic jitter는 각 125ms다.
- When: `--run`을 실행한다.
- Then
  - A의 시도는 3개이고 네 번째 Inspection 호출은 없다.
  - sleep 기록은 `[1,125ms, 2,125ms]`다.
  - A는 미완료 URL로 남고 마지막 실패는 `retryable_error`다.

### T-14 — 429에서 현재 실행을 즉시 멈춘다

- Given: 조사 대상 A·B가 미완료이고 A의 Inspection이 429를 반환한다.
- When: `--run`을 실행한다.
- Then
  - A의 시도와 `rate_limited` 결과가 저장된다.
  - Inspection 호출 목록은 `[A]`이며 B는 호출하지 않는다.
  - 429를 재시도하지 않는다.

### T-15 — property 권한 오류에서 기존 데이터를 보존한다

- Given
  - 기존 조사 대상·이벤트·요약의 bytes를 저장해 둔다.
  - property 확인은 403을 반환한다.
- When: `--run`을 실행한다.
- Then
  - Inspection 호출 수는 0이다.
  - 기존 세 파일의 bytes는 실행 전과 같다.
  - 명령은 property 권한 오류를 표시하고 실패 상태로 종료한다.

### T-16 — 재시도하지 않는 4xx 뒤에 다음 URL을 계속 검사한다

- Given
  - 조사 대상 A·B가 미완료다.
  - A는 400, B는 PASS를 반환한다.
- When: `--run`을 실행한다.
- Then
  - Inspection 호출 목록은 `[A, B]`이고 A의 재시도는 없다.
  - A는 `request_error`가 기록된 미완료 URL이다.
  - B는 성공 결과가 기록된 완료 URL이다.

### T-17 — 잘못된 sitemap에서 기존 데이터를 보존한다

- Given: 기존 `events.jsonl`과 `summary.json`에 sentinel bytes가 있다.
- When: 다음 입력을 각각 `--init`으로 실행한다.
  1. sitemap 2의 URL 목록이 비어 있다.
  2. sitemap 1에 `https://evil.example/recipes/X`가 있다.
  3. sitemap 3에 `https://www.recipio.kr/recipes/admin`이 있다.
- Then
  - 각 실행은 조사 대상을 만들지 않고 실패한다.
  - 기존 sentinel bytes는 바뀌지 않는다.
  - 인증·property 확인·Inspection 호출 수는 모두 0이다.

### T-18 — 깨진 이벤트 로그의 행을 알려주고 중단한다

- Given: `events.jsonl`의 1·2행은 유효하고 3행은 `{broken`이다.
- When: `--run`을 실행한다.
- Then
  - 오류 메시지에 `events.jsonl`과 `3`이 포함된다.
  - Inspection 호출 수는 0이다.
  - 이벤트 로그와 요약의 bytes는 실행 전과 같다.

### T-19 — 인증 정보를 모든 저장·출력 경계에서 가린다

- Given
  - credential 문자열은 `credential-super-secret`이다.
  - access token은 `token-super-secret`이다.
  - Inspection 오류에는 `Authorization: Bearer token-super-secret`이 포함돼 있다.
- When: `--run`을 실행한다.
- Then
  - inventory, events, summary, stdout, stderr 어디에도 두 secret과 Authorization 헤더가 없다.
  - 사용자에게는 민감정보가 제거된 오류만 표시된다.

### T-20 — 명령 동작을 정확히 하나만 허용한다

- Given: 기존 조사 파일에 sentinel bytes가 있다.
- When: 인자 `[]`와 `["--init", "--run"]`을 각각 실행한다.
- Then
  - 두 실행 모두 사용법을 보여주고 실패 상태로 종료한다.
  - sitemap·인증·property 확인·Inspection 호출 수는 모두 0이다.
  - 기존 파일 bytes는 바뀌지 않는다.

## 시나리오 렌즈 검토

- Happy path: T-01, T-03, T-04로 초기화→첫 결과→요약 재생성 경로를 증명한다.
- Boundary: T-10·T-11로 1,800 바로 위·아래를, T-12로 첫·중간·마지막 요청 간격을 검증한다.
- Duplicate: T-01로 sitemap 사이 중복을 검증한다.
- Empty·invalid: T-17로 빈 sitemap, 외부 origin, 예약 경로를 검증한다.
- Error: T-13~T-19로 network, 5xx, 429, 403, 400, 파일 파싱, secret 노출을 검증한다.
- State·sequence: T-02, T-06~T-09로 재초기화, 완료 URL 건너뛰기, 결과 없는 시도, 고정 조사 대상, 완료 전이를 검증한다.
- Concurrency: 단일 요청만 허용하는 설계이므로 동시 실행 충돌 처리는 범위 밖이며 별도 테스트를 두지 않는다.

## 비목표 추적

| 비목표 | 테스트 |
| --- | --- |
| 레시피 sitemap 4번 이상 | 테스트 없음 |
| 일반 페이지·재료·다국어 sitemap | 테스트 없음 |
| GSC Search Analytics 결합 | 테스트 없음 |
| 실시간 URL 검사와 색인 요청 | 테스트 없음 |
| cron·GitHub Actions 등 자동 실행 | 테스트 없음 |
| 웹 대시보드 | 테스트 없음 |
| 완료 URL의 정기 재검사와 새 조사 생성 | 테스트 없음 |
| 다른 프로세스가 소비한 GSC 할당량 추적 | 테스트 없음 |

## TDD 실행 순서

1. T-01 → T-03 → T-04로 walking skeleton을 완성한다.
2. T-20 → T-02로 명령 경계와 초기화 불변성을 고정한다.
3. T-06 → T-07 → T-08 → T-05 → T-09로 재개와 상태 집계를 완성한다.
4. T-12 → T-10 → T-11 → T-13 → T-14로 호출 여유와 요청 간격을 완성한다.
5. T-15 → T-16 → T-17 → T-18 → T-19로 오류 시 데이터 보존과 secret 차단을 완성한다.
