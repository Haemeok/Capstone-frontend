# Backend Request — Ingredient Detail 정보 보강 필드

- **From:** Frontend
- **Date:** 2026-04-27
- **Endpoint:** `GET /api/ingredients/{id}` (기존 endpoint 응답에 필드 추가)
- **Breaking:** 없음 (모두 추가만, nullable)
- **Frontend 준비 상태:** 모두 optional (`?`) 로 받고 null/undefined 정규화 완료. 백엔드가 단계적으로 채워주면 자동으로 섹션이 페이지에 나타남. 미배포 환경에서도 frontend 깨지지 않음.

## 우선순위

1. `coupangLink` — 쿠팡 파트너스 수익화 직결
2. `nutritionPer100g` — 사용자 정보 가치 가장 높음
3. `seasonMonths` — 제철 안내, 콘텐츠적 가치
4. `benefits` — 효능
5. `prepTip` — 손질 팁
6. `substitutes` — 대체 재료
7. `shortDescription` — Hero 한 줄

## 추가 필드 명세

### 1. `coupangLink: string | null`
- 쿠팡 파트너스 딥링크. 외부로 이동.
- 예: `"https://link.coupang.com/a/abcXYZ"`
- 기존 카탈로그 `IngredientItem` 응답에는 이미 존재 (`/me/fridge/items` 등). detail endpoint 에 누락된 것을 채워달라는 요청.

### 2. `nutritionPer100g: { calories, protein, carb, fat, fiber?, sugar?, sodium? } | null`
- 100g 기준 영양정보.
- 단위: `calories` = kcal, `protein/carb/fat/fiber/sugar` = g, `sodium` = mg
- 예:
  ```json
  {
    "calories": 25,
    "protein": 1.2,
    "carb": 5.8,
    "fat": 0.1,
    "fiber": 1.5,
    "sugar": 2.4,
    "sodium": 12
  }
  ```
- `fiber`, `sugar`, `sodium` 은 데이터 없으면 omit (frontend 가 optional 처리).
- 데이터 자체가 전혀 없으면 필드 자체가 `null`.

### 3. `seasonMonths: number[] | null`
- 제철 월 (1~12).
- 예: 봄~여름 제철 → `[3, 4, 5, 6]`
- 연중 출하 가능 → `[1,2,3,4,5,6,7,8,9,10,11,12]` 또는 `null` (백엔드 정책 결정).
- 정렬 보장 안 해도 됨 (frontend 가 set 으로 처리).

### 4. `benefits: string[] | null`
- 효능 bullet (3~5개 권장).
- 예: `["비타민 C 풍부", "면역력 강화", "항산화 작용"]`
- 짧은 한 줄 형태 (Hero 섹션이 아니라 bullet 이라 30자 이내 권장).

### 5. `prepTip: string | null`
- 손질 팁 (보관 메모와는 별개).
- 예: `"뿌리 부분은 잘라내고 흐르는 물에 깨끗이 씻으세요."`
- 자유 텍스트, 길이 제한 없음 (UI는 가독성 위해 leading-relaxed 적용).

### 6. `substitutes: string | null`
- 대체 재료 이름 (슬래시 구분 — 페어링과 동일 형식).
- 예: `"샬롯 / 쪽파 / 양파"`
- ID 가 아닌 이름. 페이지간 링크 안 함 (페어링과 동일 정책).

### 7. `shortDescription: string | null`
- Hero 한 줄 설명.
- 예: `"요리의 베이스가 되는 향채"`
- 50자 이내 권장.

## 응답 예시 (전체 필드 포함)

```json
{
  "id": "xJvY7aBp",
  "name": "대파",
  "category": "채소",
  "imageUrl": "https://haemeok-s3-bucket.s3.../대파.webp",
  "storageLocation": "냉장",
  "storageTemperature": "0~4℃",
  "storageDuration": "1~2일",
  "storageNotes": "구입 당일 섭취 권장. 손질 후 밀봉하여 냉동",
  "goodPairs": "돼지고기 / 마늘 / 생강",
  "badPairs": null,
  "recommendedCookingMethods": "구이 / 볶음 / 국물",
  "shortDescription": "요리의 베이스가 되는 향채",
  "coupangLink": "https://link.coupang.com/a/abcXYZ",
  "nutritionPer100g": {
    "calories": 25,
    "protein": 1.2,
    "carb": 5.8,
    "fat": 0.1,
    "fiber": 1.5
  },
  "seasonMonths": [3, 4, 5, 6, 11],
  "benefits": ["비타민 C 풍부", "혈액 순환 도움"],
  "prepTip": "뿌리 부분은 잘라내고 흐르는 물에 씻어주세요.",
  "substitutes": "쪽파 / 실파",
  "recipes": [...]
}
```

## 비고

- 모든 필드 nullable. 데이터가 없는 재료는 해당 필드를 `null` 로 보내거나 응답에서 omit 해도 됨 (frontend 동일 처리).
- 페어링/대체재료의 ID 화 (`[{id, name}]`) 는 별도 follow-up 으로 논의. 현재는 plain string 유지.
- 조리법 → 검색 deep-link 위해 `recommendedCookingMethods` 도 코드 페어링 (`{code, name}`) 으로 받는 안은 별도 follow-up.
