# 레시피북 상세 + 관리 플로우 국제화 (ja/en) — 설계

> 날짜: 2026-06-15 · 브랜치: feature/17 · Scope: M
> 보드: `I18N-STATUS.md` §3 레시피북 행 / §6 데이터-lang 결정 노트

## 배경

레시피북 **목록**(`/recipe-books`)과 그리드/카드 chrome·미러 라우트는 S4(`46766ef0`)에서
완료됨. **상세 페이지(`/recipe-books/[bookId]`)와 책 관리 플로우 전부**는 아직 하드코딩 한국어.
보드 행이 🔴로 stale했음(이번에 🟡로 갱신).

ja/en 미러 라우트는 이미 루트 페이지를 re-export 중이라 **신규 라우트 불필요**. 사전은
pathname 자가판정(`useUserPagesDict` → `resolveChromeLocale(usePathname())`), Provider 불필요.

## 접근

기존 §5 레시피 그대로. 새 네임스페이스 대신 **기존 `userPages.recipeBooks` 네임스페이스 확장**
(목록 페이지가 이미 사용 중). 번역 카피는 직역 금지 — ja/en 각 모국어 IT PM 톤(차분·실용).

## 범위

### 포함
- **상세 chrome**
  - `widgets/RecipeBookDetail/RecipeBookDetailHeader.tsx` — `N개 선택`, `편집`, 이름변경 aria
  - `widgets/RecipeBookDetail/RecipeBookRecipeGrid.tsx` — 빈상태(`아직 저장한 레시피가 없어요`·
    `레시피 둘러보기 →`), 선택 오버레이 aria(`선택`/`선택 해제`)
- **편집 모드** (`features/recipe-book-edit-mode/ui/`)
  - `EditModeBottomBar.tsx` — `모두 선택`/`선택 해제`, `이동`, `삭제`
  - `BulkDeleteConfirmModal.tsx` — 토스트·title·description·confirm/cancel 라벨
  - `MoveRecipesSheet.tsx` — 토스트(책 이름 보간)·`새 레시피북 만들기`·빈상태·`N개`·헤더
- **책 관리 시트**
  - `features/recipe-book-rename/ui/RenameRecipeBookSheet.tsx`
  - `features/recipe-book-create/ui/CreateRecipeBookSheet.tsx`
  - `features/recipe-book-delete/ui/DeleteRecipeBookModal.tsx` — 토스트(책 이름 보간)·title·
    description·confirm/cancel
- **엔티티 메시지**
  - `entities/recipe-book/model/errorMessages.ts` — 코드 1101~1107 + fallback
  - `entities/recipe-book/model/schema.ts` — zod 검증(이름 필수·50자 초과)
- **데이터 lang**
  - `entities/recipe-book/api/getRecipeBookDetail.ts` — `lang` 파라미터 추가(ko 생략) →
    책 안 레시피 카드 제목 현지화
- **공유 에러 헬퍼에 끌려오는 인접 항목**
  - `features/recipe-book-change/ui/ChangeBookSheet.tsx` — 페이지 밖(레시피 상세/카드의 "저장"
    픽커)이지만 `getRecipeBookErrorMessage`를 공유. 헬퍼를 locale-aware로 바꾸면 locale 인자가
    여기까지 흐르므로, 반쯤 현지화 상태로 두지 않고 인라인 문자열까지 마저 처리.

### 비목표 (Non-goals)
- 유저가 만든 **책 이름**(데이터, chrome 아님 — 표시만, 번역 안 함)
- `widgets/RecipeGrid/ui/DetailedRecipeGridItem` 카드 **내부**(공유 위젯, 소유 영역 다름)
- 레시피북 **목록** 페이지(이미 완료) 재작업
- next-intl 전환·`<html lang>` per-locale(전역 후속)

## 비자명한 설계 결정

### 1. 에러 처리: 텍스트 매칭이 아니라 코드로 분기

현재 `getRecipeBookErrorMessage(error)`는 한국어 문자열을 반환하고, rename/create 시트가
`message.includes("같은 이름")` / `message.includes("기본 레시피북")`로 **인라인 필드 에러 vs
토스트**를 판별. 메시지를 현지화하면 이 substring 매칭이 **깨짐**.

수정: 헬퍼를 locale-aware로 + 코드 노출.

- `getRecipeBookError(error, locale): { code: number | null; message: string }`
  - 메시지는 `userPages.recipeBooks.errors`(코드별) + fallback에서 locale로 조회.
- 호출부는 **코드로 분기**: 필드 레벨 = `1107`(중복)·`1104`(기본책 이름변경) → `form.setError`;
  그 외 → 토스트. 깨지기 쉬운 substring 매칭 완전 제거.
- 8개 호출부(change·create·delete·edit-mode bulk-delete·move·rename) 전부 locale 전달
  (`useUserPagesLocale()`로 컴포넌트에서 해석). 기존 `getRecipeBookErrorMessage`는 호환을 위해
  남길지/걷어낼지는 계획 단계에서 — 단일 신규 API로 통일 권장.

### 2. 데이터 lang은 요청에만, queryKey엔 넣지 않음

`getRecipeBookDetail`에 `lang`만 추가. **queryKey·initialData seeding은 일절 안 건드림.**

- 이유: 상세 그리드가 `initialData`(preview seeding, `RECIPE_BOOK_QUERY_KEYS.detail`)에 의존.
  키에 locale을 넣으면 seeding 전 지점(`useRecipeBookDetail`·previewKey·외부 카드 seeding)에
  동일 locale을 박아야 매칭되고, 한 곳만 누락해도 crash 없이 조용히 preview 미적용→스켈레톤
  깜빡(silent 버그). 키잉이 막는 코스메틱 깜빡(언어 스위치 직후)은 설치 고정 언어라 실이득 ≈0.
- `getIngredients` 규칙과 동일. 상세 페이지는 client 전용이라 hydration mismatch 없음.
- 상세 결정 근거: `I18N-STATUS.md` §6 [2026-06-15] 노트.

### 3. 한국어 조사 보간

`MoveRecipesSheet`/`ChangeBookSheet`/`DeleteRecipeBookModal`이 `${bookName}으로 이동했어요` 등
조립 — `으로/로` 조사는 받침 의존. ja/en은 `format()` 템플릿의 `{name}` 플레이스홀더로 처리(조사
없음). 한국어는 기존 문자열 유지. 조사 로직 불필요.

## 사전 구조 (`userPages.recipeBooks` 확장)

기존 키(heading·listLoadError·boundaryError·cardMenuAria·rename·delete·savedCount·createAria·
createLabel) 유지 + 추가:

- `detail`: `editButton`, `selectedCount`(plural/format), `renameAria`
- `grid`: `emptyTitle`, `emptyCta`, `selectAria`, `deselectAria`
- `editMode`: `selectAll`, `deselectAll`, `move`, `delete`
- `bulkDelete`: `toast`(format count), `title`(format count), `description`, `confirm`, `cancel`
- `move`: `toast`(format name), `createNew`, `emptyWithCreate`, `empty`, `countSuffix`(format), `heading`
- `change`: `notFound`, `toast`(format name), `createNew`, `emptyWithCreate`, `empty`, `countSuffix`, `heading`
- `rename`: `title`, `placeholder`, `cancel`, `submit`, `submitting`, `duplicate`, `toast`
- `create`: `title`, `placeholder`, `cancel`, `submit`, `submitting`, `duplicate`, `toast`, `triggerLabel`
- `deleteBook`: `toast`(format name), `title`(format name), `description`, `confirm`, `cancel`
- `errors`: 코드별(1101~1107) + `fallback`
- `validation`: `nameRequired`, `nameMax`

> 키 정확한 분할/네이밍은 vertical-slicing/test-design에서 글로서리 단어로 확정. 위는 초안.

## zod 검증 (locale-aware 팩토리)

`recipeForm` 선례 답습: `buildRecipeBookFormSchema(validation)` — `{ nameRequired, nameMax }`
주입. rename/create 시트가 `useMemo`로 resolver 안정화(`useT`/dict에서 `validation` 추출).
코드/비교값은 ko canonical 불변(표시 메시지만 현지화).

## 수용 기준 (Acceptance Criteria)

- **AC1** 라우트가 `/ja/recipe-books/[bookId]` 또는 `/en/...`일 때 상세 헤더·편집 바·빈상태·모든
  선택 aria-label이 타깃 언어로 렌더(한글 0).
- **AC2** ja/en 유저가 책을 열면 레시피 카드 제목이 해당 언어로 옴(`getRecipeBookDetail`가
  `lang` 전송).
- **AC3** 생성/이름변경이 중복(1107)·기본책 이름변경(1104)에 걸리면 **인라인 필드 에러**로 활성
  언어 표시; 그 외 코드는 **토스트**로 활성 언어 표시.
- **AC4** ja/en 유저가 레시피/책을 이동·삭제하면 성공 토스트가 타깃 언어로, 책 이름이 보간되고
  한국어 조사 잔재 없음.
- **AC5** 이름 검증 실패(빈값 / 50자 초과) 시 zod 메시지가 활성 언어로.
- **AC6** 한국어(`/recipe-books/...`)는 불변 — 동일 문자열·동일 동작(회귀 앵커).

## 검증

`npx tsc --noEmit` + 각 컴포넌트 ja/en no-Hangul 렌더 테스트(Radix portal은 `baseElement.
textContent`로 검사 — 보드 교훈) + ko 회귀 앵커. 에러 코드 분기는 1104/1107→필드, 그 외→토스트
단위 테스트.
