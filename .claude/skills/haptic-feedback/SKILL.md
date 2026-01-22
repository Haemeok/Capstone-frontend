---
name: haptic-feedback
description: iOS/Android haptic feedback guidelines for mobile-first PWA. This skill should be used automatically when creating or modifying interactive UI components, buttons, toggles, sliders, tabs, or any user-triggered actions. Triggers on tasks involving UI interactions, button clicks, form submissions, or mobile UX.
license: MIT
metadata:
  author: recipio
  version: "2.0.0"
---

# 햅틱 피드백 가이드라인 (Enterprise-Level)

토스, 카카오뱅크, 배달의민족, 당근마켓 등 국내 대기업 앱의 UX 패턴을 기반으로 한 햅틱 피드백 구현 가이드.

## 핵심 원칙

### 1. 햅틱은 "확인"이다
사용자가 터치했을 때 **"네, 입력 받았습니다"**라는 물리적 확인을 제공하는 것이 햅틱의 본질이다. 시각적 피드백만으로는 부족한 상황에서 촉각 피드백을 더해 **확신**을 준다.

### 2. 과하면 독이다
모든 곳에 햅틱을 넣으면 사용자는 진동을 무시하게 된다. **의미 있는 순간**에만 사용해야 한다.

### 3. 일관성이 생명이다
같은 유형의 인터랙션에는 같은 강도의 햅틱을 사용한다. 토글 A와 토글 B가 다른 느낌을 주면 안 된다.

---

## 햅틱 유틸리티

```typescript
import { triggerHaptic } from "@/shared/lib/bridge";

// HapticStyle: "Light" | "Medium" | "Heavy" | "Success" | "Warning" | "Error"
triggerHaptic("Light");   // 가벼운 탭 - 일반 인터랙션
triggerHaptic("Medium");  // 중간 강도 - 중요한 선택
triggerHaptic("Heavy");   // 강한 진동 - 거의 안 씀
triggerHaptic("Success"); // 성공 패턴 - 완료/달성
triggerHaptic("Warning"); // 경고 패턴 - 주의 필요
triggerHaptic("Error");   // 에러 패턴 - 실패/오류
```

---

## 상세 적용 가이드

### ✅ 반드시 햅틱을 넣어야 하는 곳

#### 1. 토글/스위치 (Light)
**이유**: 물리적 스위치를 누르는 느낌을 재현. ON/OFF 상태 변경이 실제로 일어났음을 확인.

```typescript
// 모든 토글 컴포넌트
const handleToggle = () => {
  triggerHaptic("Light");
  onChange(!value);
};
```

**적용 대상**:
- 알림 설정 토글
- 다크모드 토글
- 공개/비공개 토글
- 자동/수동 모드 전환
- ON/OFF 형태의 모든 스위치

#### 2. 세그먼트 컨트롤 / 탭 전환 (Light)
**이유**: 탭이 물리적으로 "착" 하고 걸리는 느낌. 현재 선택이 바뀌었음을 확인.

```typescript
// 탭 전환 - 상태가 실제로 바뀔 때만
const handleTabChange = (newTab: string) => {
  if (activeTab !== newTab) {  // 이미 선택된 탭 다시 누르면 햅틱 X
    triggerHaptic("Light");
    setActiveTab(newTab);
  }
};
```

**적용 대상**:
- 마이페이지 탭 (레시피/저장됨/캘린더)
- 스트릭/사진 모드 전환
- 매크로/칼로리 모드 전환
- 필터 세그먼트 (최신순/인기순)

#### 3. 칩/태그 선택 (Light)
**이유**: 버튼보다 작은 터치 영역에서 "선택됨"을 명확히 전달.

```typescript
// 필터 칩, 카테고리 태그 등
const handleChipClick = () => {
  triggerHaptic("Light");
  onSelect();
};
```

**적용 대상**:
- 필터 칩 (FilterChip)
- 재료 태그 선택
- 카테고리 선택
- 스타일 선택 버튼 (StyleSelector)
- 다중 선택 옵션들

#### 4. 슬라이더 눈금 (Light, Step-Based)
**이유**: 아날로그 다이얼을 돌릴 때 "딸깍딸깍" 걸리는 느낌. 현재 값이 어디인지 손끝으로 인지.

**⚠️ 성능 주의**: 매 픽셀마다 햅틱을 주면 프레임 드랍 + 배터리 소모. 반드시 step 단위로만.

```typescript
import { useRef } from "react";

const step = 5; // 슬라이더의 step 값
const lastStepRef = useRef<number | null>(null);

const handleSliderChange = (vals: number[]) => {
  const newValue = vals[0];
  const currentStep = Math.floor(newValue / step);

  // step이 변경될 때만 햅틱 (1픽셀 움직임에는 반응 X)
  if (lastStepRef.current !== null && currentStep !== lastStepRef.current) {
    triggerHaptic("Light");
  }
  lastStepRef.current = currentStep;

  onChange(newValue);
};
```

**슬라이더별 step 설정**:
| 슬라이더 | 범위 | step | 햅틱 횟수 |
|----------|------|------|-----------|
| 탄수화물 | 0-150g | 5g | 최대 30회 |
| 단백질 | 0-150g | 5g | 최대 30회 |
| 지방 | 0-100g | 5g | 최대 20회 |
| 칼로리 | 0-2000kcal | 50kcal | 최대 40회 |
| 매운맛 | 0-5 | 1 | 최대 5회 |
| 인분 | 1-10 | 1 | 최대 10회 |

#### 5. 완료/성공 이벤트 (Success)
**이유**: 작업 완료의 "보람"을 촉각으로 전달. 토스의 송금 완료, 배민의 주문 완료 느낌.

```typescript
// TanStack Query mutation onSuccess
const { mutate } = useMutation({
  mutationFn: createRecipe,
  onSuccess: () => {
    triggerHaptic("Success");  // 토스트보다 먼저!
    toast.success("레시피가 생성되었습니다");
  },
});
```

**적용 대상**:
- 레시피 생성 완료
- 레시피 수정 완료
- 레시피 삭제 완료
- 댓글 작성 완료
- 댓글 삭제 완료
- 레벨업 달성
- 유튜브 URL 추출 완료
- 프로필 수정 완료
- 설정 저장 완료

#### 6. 좋아요/북마크 (Light)
**이유**: 인스타그램 더블탭 좋아요의 "툭" 느낌. 감정적 액션에 물리적 피드백.

```typescript
const handleLike = () => {
  triggerHaptic("Light");
  toggleLike();
};
```

**적용 대상**:
- 레시피 좋아요
- 댓글 좋아요
- 북마크/저장
- 팔로우

#### 7. 바텀 네비게이션 (Light)
**이유**: 앱의 메인 허브 이동. 현재 위치가 바뀌었음을 확인.

```typescript
// 현재 탭과 다른 탭을 누를 때만
const handleNavClick = (tab: string) => {
  if (currentTab !== tab) {
    triggerHaptic("Light");
    navigate(tab);
  }
};
```

#### 8. 캘린더/날짜 네비게이션 (Light)
**이유**: 월 이동 시 시간이 "넘어갔다"는 느낌.

```typescript
const handlePrevMonth = () => {
  triggerHaptic("Light");
  setMonth(prev => subMonths(prev, 1));
};

const handleNextMonth = () => {
  triggerHaptic("Light");
  setMonth(prev => addMonths(prev, 1));
};
```

#### 9. 드로어/바텀시트 열기 (Light)
**이유**: 새로운 UI 레이어가 올라왔음을 확인.

```typescript
// 열기 트리거 버튼에서
const handleOpenDrawer = () => {
  triggerHaptic("Light");
  setIsOpen(true);
};
```

**적용 대상**:
- 필터 드로어 열기
- 공유 바텀시트 열기
- 옵션 메뉴 열기
- 상세 정보 패널 열기

---

### ❌ 햅틱을 넣으면 안 되는 곳

#### 1. 일반 페이지 이동 링크
```typescript
// ❌ 햅틱 넣지 말 것
<Link href="/recipes/123">레시피 보기</Link>
```
**이유**: 너무 빈번함. 모든 링크에 진동이 울리면 피로감.

#### 2. 스크롤 이벤트
```typescript
// ❌ 절대 넣지 말 것
onScroll={() => triggerHaptic("Light")}
```
**이유**: 초당 수십 번 호출. 배터리 + 성능 파괴.

#### 3. 입력 필드 포커스
```typescript
// ❌ 햅틱 넣지 말 것
<input onFocus={() => triggerHaptic("Light")} />
```
**이유**: 키보드가 올라오는 것 자체가 피드백. 이중 피드백은 과함.

#### 4. 호버 효과 (데스크톱)
```typescript
// ❌ 데스크톱에선 햅틱 자체가 없음
onMouseEnter={() => triggerHaptic("Light")}
```

#### 5. 자동 트리거 이벤트
```typescript
// ❌ 사용자가 직접 트리거하지 않은 이벤트
useEffect(() => {
  if (data) triggerHaptic("Success"); // 자동 로드 완료
}, [data]);
```
**이유**: 사용자 액션 없이 진동이 울리면 당황스러움.

#### 6. 폼 입력 중 실시간 검증
```typescript
// ❌ 타이핑할 때마다 진동
onChange={(e) => {
  setValue(e.target.value);
  if (isValid) triggerHaptic("Success"); // 매 글자마다?
}}
```
**이유**: 너무 빈번함. 제출 시점에 한 번만.

#### 7. 로딩 상태 변화
```typescript
// ❌ 로딩 시작/끝에 진동
if (isLoading) triggerHaptic("Light");
```
**이유**: 사용자 액션이 아님.

#### 8. 이미 선택된 항목 다시 탭
```typescript
// ❌ 상태 변화 없으면 햅틱도 없음
const handleTabClick = (tab: string) => {
  triggerHaptic("Light"); // 이미 선택된 탭이어도 진동?
  setActiveTab(tab);
};

// ✅ 올바른 패턴
const handleTabClick = (tab: string) => {
  if (activeTab !== tab) {
    triggerHaptic("Light");
    setActiveTab(tab);
  }
};
```

---

### ⚠️ 상황에 따라 판단이 필요한 곳

#### 1. 일반 버튼 클릭
- **CTA 버튼 (제출, 저장 등)**: 햅틱 ❌ → Success 햅틱은 성공 시점에
- **선택형 버튼 (스타일 선택 등)**: 햅틱 ✅ Light
- **취소/닫기 버튼**: 햅틱 ❌

#### 2. 카드 탭
- **상세 페이지로 이동**: 햅틱 ❌ (일반 링크와 동일)
- **카드 내 액션 (좋아요 등)**: 햅틱 ✅ Light

#### 3. 삭제 확인
- **삭제 버튼 첫 탭**: 햅틱 ❌
- **확인 다이얼로그에서 "삭제" 탭**: 햅틱 ❌ → 삭제 성공 시 Success

---

## 파일별 체크리스트

새로운 파일을 생성하거나 수정할 때 아래 패턴을 확인:

| 파일 패턴 | 확인 사항 | 햅틱 타입 |
|-----------|-----------|-----------|
| `**/hooks.ts` (mutation) | `onSuccess` 콜백 | `Success` |
| `**/*Toggle*.tsx` | `onChange` 핸들러 | `Light` |
| `**/*Tab*.tsx` | 탭 전환 핸들러 (상태 변경 시만) | `Light` |
| `**/*Chip*.tsx` | `onClick` 핸들러 | `Light` |
| `**/*Selector*.tsx` | 선택 핸들러 | `Light` |
| `**/*Slider*.tsx` | step 기반 `onChange` | `Light` (useRef) |
| `**/*Drawer*.tsx` 트리거 | 열기 버튼 | `Light` |
| `**/*Modal*.tsx` 트리거 | 열기 버튼 | `Light` |
| `**/*Navigation*.tsx` | 탭 전환 (상태 변경 시만) | `Light` |
| `**/Like*.tsx` | 좋아요 토글 | `Light` |
| `**/Bookmark*.tsx` | 북마크 토글 | `Light` |

---

## 구현 시 주의사항

### 1. 햅틱 호출 위치
```typescript
// ✅ 상태 변경과 동시에 (동기적)
const handleToggle = () => {
  triggerHaptic("Light");  // 먼저 햅틱
  onChange(!value);        // 그 다음 상태 변경
};

// ❌ 비동기 완료 후에만 (너무 늦음)
const handleToggle = async () => {
  await updateServer();
  triggerHaptic("Light");  // 서버 응답 후라 늦음
};
```

### 2. 조건부 햅틱
```typescript
// ✅ 상태가 실제로 바뀔 때만
if (currentValue !== newValue) {
  triggerHaptic("Light");
}

// ❌ 무조건 호출
triggerHaptic("Light"); // 상태 변화 없어도 진동?
```

### 3. 슬라이더 성능 최적화
```typescript
// ✅ useRef로 이전 step 추적 (리렌더링 없음)
const lastStepRef = useRef<number | null>(null);

// ❌ useState로 추적 (불필요한 리렌더링)
const [lastStep, setLastStep] = useState(0);
```

### 4. 서버 컴포넌트 주의
```typescript
// ❌ 서버 컴포넌트에서 직접 호출 불가
// "use client" 없는 컴포넌트

// ✅ 클라이언트 컴포넌트에서만 사용
"use client";
import { triggerHaptic } from "@/shared/lib/bridge";
```

---

## 테스트 체크리스트

신규 기능 배포 전 iOS 실기기에서 확인:

- [ ] 토글 전환 시 "딸깍" 느낌 확인
- [ ] 탭 전환 시 부드러운 피드백 확인
- [ ] 슬라이더 드래그 시 step마다 진동 확인 (프레임 드랍 없이)
- [ ] 작업 완료 시 "성공" 진동 확인
- [ ] 이미 선택된 항목 재탭 시 진동 없음 확인
- [ ] 일반 링크 탭 시 진동 없음 확인
