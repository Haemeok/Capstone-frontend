# 냉장고 재료 추가 i18n — 테스트 설계 (매트릭스)

> 날짜: 2026-06-14 · 브랜치: feature/17
> 슬라이스: `2026-06-14-fridge-ingredient-add-i18n-slices.md`

## 깊이 원칙 (blast radius)

표시 문자열 현지화 = **cosmetic**. 따라서:

- **벌크 커버리지 owner = no-Hangul 렌더 가드.** 각 ja/en 표면을 렌더해 `/[가-힣]/`
  0을 단언 → "전부 현지화됐다"를 한 테스트가 증명하고, 누락(미추출 inline·재료명
  빠짐)을 포착. per-key 등식(`expect(t.x).toBe("…")` N개)은 **change-detector라 금지**.
- **타깃 단언**은 동작이 걸린 곳만: 치환(count·query), 리졸버 분기(택소노미·재료명
  fallback), href(locale-sticky).
- **ko 회귀 앵커** 1개/표면.
- 모킹은 소유 안 한 경계만 — `getIngredients`(network)만 모킹. 자기 컴포넌트·사전·
  리졸버는 모킹 ❌. (renderHook 아닌 render 사용 — 불안정참조 OOM 회피, 변경파일만 실행)

## 트레이서빌리티 매트릭스

| AC | 시나리오 (Given/When/Then 요지) | Test ID | Owner | Risk |
| --- | --- | --- | --- | --- |
| S1-AC1/4 | `/ja/ingredients/new` 렌더 → 헤더 "食材を追加" + 검색진입 aria 일본어, 페이지 chrome 한글 0 | T-01 | acceptance | cosmetic |
| S1-AC2 | `/en/...` 렌더 → 헤더 영어, chrome 한글 0 | T-02 | acceptance | cosmetic |
| S1-AC3 | `/ingredients/new`(ko) 렌더 → 헤더 "재료 추가", 동일 위젯 | T-03 | acceptance | cosmetic |
| S2-AC1/5 | ja 검색 드로어 open(재료 mock=[]) → 드로어 chrome 한글 0 | T-04 | component | cosmetic |
| S2-AC1/5 | en 검색 드로어 → 한글 0 | T-05 | component | cosmetic |
| S2-AC2 | ja 드로어 → 카테고리 칩 "전체"가 "すべて"로 (택소노미 경유) | T-06 | component | integrity |
| S2-AC3 | searchQuery="존재안함", mock 0건 → noResults 일본어 + query "존재안함" 치환 표시 | T-07 | component | integrity |
| S2-AC4 | getIngredients reject → 에러 문구 일본어(한글 0) | T-08 | component | cosmetic |
| S2-AC6 | ko 드로어 → "재료 추가"·"닫기" 존재 | T-09 | component | cosmetic |
| S3-AC1/5 | `localizePack(packA,"ja")`→ja name/desc; `"en"` 동일; 오버레이 누락 locale→ko fallback | T-10 | unit | integrity |
| S3-AC1 | ja 팩 카드 렌더 → packA 현지 name/desc 표시, 카드 한글 0 | T-11 | component | cosmetic |
| S3-AC3 | ja 카드 → "재료 N개"가 N(예 30) 치환된 현지 템플릿 | T-12 | component | integrity |
| S3-AC2 | 전 재료 보유 카드 → "보유 중" 배지 현지어 | T-13 | component | cosmetic |
| S3-AC4/5 | ko 카드 → ko 팩명 + aria "{koName} 상세 보기" | T-14 | component | cosmetic |
| S4-AC3 | `localizeIngredientName(id,koName,"ja")`→오버레이 있으면 ja, 없으면 koName | T-15 | unit | integrity |
| S4-AC1..5 | **ja 팩 상세 드로어(packA) 전체 렌더 → 한글 0** (재료명 누락 포착) | T-16 | acceptance | integrity |
| S4-AC1..5 | **en 팩 상세 드로어 → 한글 0** | T-17 | acceptance | integrity |
| S4-AC1/2 | ja 드로어 → "· 총 N개" + "N개 선택됨" count 치환 현지어 | T-18 | component | integrity |
| S4-AC4 | 선택 2개 → CTA "2{...}追加" 현지 + count; allOwned→삭제 라벨 | T-19 | component | integrity |
| S4-AC6 | ko 드로어 → ko 재료명·chrome 존재 | T-20 | component | cosmetic |
| S5-AC1 | ja MyFridgeRecipeCard(cookingTime=40) → "40分"; en → "40 min" | T-21 | component | cosmetic |
| S5-AC2 | ko 카드 → "40분" | T-22 | component | cosmetic |
| S6-AC1/2 | `/ja..`·`/en..` 빈상태 → CTA href `/ja|/en/ingredients/new` | T-23 | component | integrity |
| S6-AC3 | ko 빈상태 → CTA href `/ingredients/new` | T-24 | component | cosmetic |

> T-01/02, T-04/05, T-16/17, T-21(ja·en), T-23(ja·en)은 `it.each([ja,en])` 1테스트로
> 묶어 구현(레이어 동일). ko 앵커는 별 케이스.

## 시나리오 구체값 (대표)

- **T-06**: pathname `/ja/ingredients/new`, 카테고리 칩 목록 렌더 → "すべて" 노드 존재,
  "전체" 노드 부재.
- **T-07**: `getIngredients` mock → `{content:[], ...}`; inputValue submit "존재안함";
  `screen.getByText` 정규식 `/存在しない|該当する.*ありません/` 中 query "존재안함" 포함.
  (정확 카피는 사전 작성 시 확정 — 테스트는 query 치환 + 한글 0만 단언)
- **T-10**: `localizePack({name:"한식 기본 베이스",...},"ja")` → `name!=="한식 기본 베이스"`
  且 한글 0; locale 오버레이에 없는 키 → 입력 name 그대로(fallback) 반환.
- **T-15**: `localizeIngredientName("OAeLoBLq","김치","ja")` → "キムチ" 등 비한글;
  미등록 id → "김치"(fallback).
- **T-16**: pathname `/ja/ingredients/new`, packA=INGREDIENT_PACKS[0] 상세 드로어 open,
  `container.textContent` 에 `/[가-힣]/` 매치 0. (packA 재료 전부 오버레이 커버 증명)
- **T-21**: recipe `{cookingTime:40,...}`, pathname ja → `getByText("40分")`.
- **T-23**: pathname `/ja/recipes/my-fridge`, noResults 빈상태 → CTA `closest("a")` href
  `/ja/ingredients/new`.

## 커버리지 게이트

- 모든 슬라이스 AC가 ≥1 Test ID 보유 — S1..S6 전 AC 매핑 확인(위 표).
- 각 표면(페이지·검색드로어·팩카드·팩상세) ja/en **no-Hangul 가드 owner** 보유.
- 각 표면 ko 회귀 앵커 보유(T-03·T-09·T-14·T-20·T-22·T-24).
- 리졸버 분기(T-10·T-15)·치환(T-07·T-12·T-18·T-19)·href(T-23/24)는 owner=해당 층 1회.
- per-key 등식 테스트 0 (change-detector 배제).

## 비목표 (테스트 없음 — 의도적 부재)

- `/ingredients`(재료 목록)·그 페이지 링크
- SEO 인덱싱(noindex)·통화·`<html lang>`
- 백엔드 재료 데이터 번역(이미 됨), `getIngredients` lang 전파(이미 됨)
- 모바일 `IngredientPicker`(이미 i18n·테스트 보유)
- `localizedHref`/`LocalizedLink` 내부(언어 스위처 작업서 소유·테스트됨) — T-23/24는
  "MyFridgeEmptyState가 LocalizedLink를 쓴다"는 seam만 단언, 내부 재검증 ❌

## 순서 (TDD walking skeleton)

T-03(ko 앵커, 위젯 추출 증명) → T-01/02(ja/en 셸) → T-04..09(드로어) →
T-10/11..14(팩 카드) → T-15..20(팩 상세) → T-21/22(분 단위) → T-23/24(CTA).
