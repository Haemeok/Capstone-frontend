# 검색 진입 페이지 i18n — 테스트 설계

> 브랜치: feature/17 · 작성: 2026-06-13
> 슬라이스: `2026-06-13-search-discovery-i18n-slices.md`
> 리스크 등급: **integrity/cosmetic** (security·billing 없음) → 적대적 깊이 ❌,
> 불변식 + 대표 앵커 + 누락 가드만. 카피 12장 전수 단언(change-detector) 금지.

## 테스트 철학 (이 피처 한정)

- **owner = 컴포넌트 렌더 seam.** 위젯에 `locale` prop을 주고 렌더 → 대표 앵커가
  사전 값으로 나오는지(wiring), ja/en에 한글 잔존이 없는지(누락 가드) 본다.
  기존 `BottomNavBar.i18n.test`·`CategoryTabs.i18n.test` 패턴 답습.
- **앵커는 사전 상수 참조로 단언**(하드코딩 리터럴 ❌). 예:
  `getByText(messages.ja.searchDiscovery.contentSectionTitle)` → "컴포넌트가 사전을
  읽는다"는 계약을 잡되, 카피 글자 바뀐다고 깨지지 않음.
- **누락 가드(false-comfort killer):** 타입 게이트는 키 누락만 잡지 *미추출 inline
  한글*은 못 잡는다(`policy-i18n-type-gate-misses-unextracted-strings`). ja/en 렌더에
  한글 0을 단언해 보완. 백엔드 레시피 데이터는 빈 배열 mock(우리가 소유 안 한 경계만 mock).

## Traceability Matrix

| AC | 시나리오 | Test ID | Owner | Risk |
| -- | -------- | ------- | ----- | ---- |
| AC0.1/0.2 | Default `locale=ja`/`en` → 섹션 헤딩·최신 슬라이드 제목이 해당 locale 사전 값으로 렌더 | **T-01** | component | integrity |
| AC0.4·AC2.3 | Default `locale=ko` → ko 헤딩·카드 앵커·가격 섹션 그대로(회귀) | **T-02** | component | integrity |
| AC0.3 | Default `locale=ja`&`en` → 가격대 섹션이 DOM에 없음 | **T-03** | component | integrity |
| AC0.1/0.2·AC2.1·AC3.1 | Default `locale=ja`&`en`(레시피 데이터 빈 mock) → 렌더된 chrome에 한글 0 | **T-04** | component | integrity |
| AC0.5 | `searchDiscovery` 키 누락 → `tsc --noEmit` 실패 | **T-05** | compiler | integrity |
| AC0.1 | `/ja/search` generateMetadata → robots `{index:false, follow:true}` | **T-06** | node | integrity |
| AC1.1·AC1.2 | `getPlaceholders(locale, hour)`: ja 8시→아침버킷, 13시→점심, 20시→저녁; 경계 5/11/17; ko 동일 버킷 | **T-07** | unit | integrity |
| AC1.1·AC1.2 | ja·en placeholder 배열에 한글 0; ko 배열엔 한글 존재(sanity) | **T-08** | unit | integrity |
| AC1.3 | 모든 locale의 모든 placeholder ≤ 글자수 예산 | **T-09** | unit | cosmetic |
| AC2.1 | Default `locale=ja` → 첫 큐레이션 카드 title이 ja 사전 값 | **T-10** | component | integrity |
| AC2.2 | 카드 href가 searchParams로 빌드(필터 유지) | *기존* `buildSearchResultsUrl.test` | unit | integrity |
| AC3.1 | NutritionThemeSection `locale=ja` → 첫 테마 label이 ja 사전 값 | **T-11** | component | integrity |
| AC3.2 | `NUTRITION_THEMES.<key>.label`이 여전히 ko(상수 불변) → 공유 소비자 무영향 | **T-12** | unit | integrity |
| AC3.3 | 테마 href 동일 작동 | *기존* `buildSearchResultsUrl.test` | unit | integrity |
| AC4.1 | Focused `locale=ja` → "최근 검색어"·"최근 본" 앵커가 ja 사전 값 | **T-13** | component | integrity |
| AC4.2 | Focused `locale=ko` → ko 앵커 그대로; Focused `ja`&`en` → 한글 0 | **T-14** | component | integrity |

## 구체 예시 (Given/When/Then — 실제 값)

- **T-03:** Given `SearchDiscoveryDefault locale="ja"` 렌더(레시피 데이터 빈 mock).
  When 트리 조회. Then `PriceRangeSection`의 가격대 카드/헤딩이 **존재하지 않음**
  (`queryBy…` null). 동일 `locale="ko"` 렌더에선 존재.
- **T-04:** Given `locale="ja"` 그리고 `"en"` 각각 렌더(빈 레시피 mock). When
  `container.textContent`에 한글 정규식(`/[가-힣]/`) 매칭. Then **0 매칭**.
- **T-07:** Given `getPlaceholders("ja", 8)`. Then 아침 버킷(=ja 사전 breakfast 배열)
  반환. `("ja", 13)`→점심, `("ja", 20)`→저녁, 경계 `5`→아침·`11`→점심·`17`→저녁.
  `("ko", 8)`도 아침 버킷(버킷 로직은 locale 불변, 배열만 locale).
- **T-09:** Given 모든 locale × 모든 시간대 placeholder. Then 각 문자열 길이 ≤ 해당
  locale 예산(ko/ja=20, en은 단어폭 고려 별도값). 위반 배열 = []이어야.
- **T-12:** Given `NUTRITION_THEMES`(상수) import. Then `.keto?.label`(또는 첫 키)이
  ko 문자열("키토")과 동일 → 상수 미변형 증명. 로케일 라벨은 별도 맵에서만.

## Coverage Gate

- 모든 AC에 ≥1 Test ID ✓ (AC2.2/AC3.3은 기존 url 테스트로 커버, 신규 ID 없음 — 명시).
- happy + 관련 edge/누락 가드 동반: T-01(happy)+T-04(누락), T-07(happy+boundary).
- 각 슬라이스에 ≥1 acceptance(컴포넌트 렌더) 테스트 ✓.
- owner-layer 중복 없음: 한글 누락 가드는 Default(T-04)·Focused(T-14)로 렌더 영역별
  1회씩(각자 자기 영역 미추출 문자열을 잡음). 버킷 로직은 pure fn(T-07) 1회.

### Non-goals (테스트 없음 — 의도적 부재)

- 가격대 섹션 ja/en 번역 — no test
- `NUTRITION_THEMES` 타 소비자(검색결과 필터·SEO) 로케일화 — no test (T-12는 *불변* 증명일 뿐)
- `/search` hreflang/색인 — no test
- 언어 스위처 — no test
- `/search/results` — no test (별도 완료)
- 백엔드 데이터 번역 — no test (다른 축)
- 카피 자연스러움/현지성 — **기계 테스트 불가, PM 휴먼 리뷰 항목**(보드 수동검증으로)

## TDD 순서 (walking skeleton first)

T-01 → T-02 → T-03 → T-04 → (T-05 빌드) → T-06 → T-07 → T-08 → T-09 → T-10 →
T-11 → T-12 → T-13 → T-14.
