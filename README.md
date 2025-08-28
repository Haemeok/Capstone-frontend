## [AI 레시피 플랫폼: 해먹 🚗](https://www.haemeok.com/)

- 배포 주소 : https://www.haemeok.com/

## 프로젝트 소개

> **해먹**은 AI로 레시피를 생성하고, 공유할 수 있는 플랫폼입니다.
>
> 외식과 배달 물가가 오르는 만큼 집에서 요리하면서 비용을 아껴보세요!
> 재료 기반으로 냉장고를 관리하면서 레시피를 탐색할 수 있습니다.
>
> 최신 AI 모델로 보유한 재료를 활용한 레시피를 생성할 수 있습니다.

## 핵심 기능

### 냉장고 재료 관리

<img width="300" height="400" alt="image" src="https://github.com/user-attachments/assets/94b92c29-9313-41e2-94ad-7a2dcb8be095" />

> 사용자는 보유한 재료로 레시피를 생성할 수 있습니다.

### 개인화 데이터 관리

<img width="300" height="400" alt="image" src="https://github.com/user-attachments/assets/3f3c350a-46a8-4d73-aa21-35831c77e824" />

> 사용자의 알레르기 정보, 취향 등을 저장하여 레시피 생성, 검색에 활용합니다.

### AI 레시피 생성 및 공유

<img width="300" height="400" alt="image" src="https://github.com/user-attachments/assets/455ac18e-093a-444e-9533-e78dff4af144" />

> 사용자는 선택한 AI 모델과 함께 사용자 맞춤형 레시피를 생성할 수 있습니다.

## 🛠️ 기술적 과제 및 해결 과정

### [Next.js 기반 하이브리드 렌더링 아키텍처 설계 및 웹 성능 최적화](https://glass-writer-f4a.notion.site/Frontend-Developer-2485aca8e19380c7ac2ed382051884f3?p=2485aca8e193802aa985c65ded6b7eed&pm=c)

- **문제**: 초기 아키텍처의 기술적 제약(CSR)으로 신규 트래픽 확보라는 핵심 비즈니스
  목표 달성 불가. 또한, FCP 6.9초의 저조한 성능이 잠재적 사용자 이탈률을 높이는
  리스크로 작용.

- **해결**: 페이지의 특성(데이터 실시간성, SEO 중요도, 인터랙션 유무)에 따라 SSR,
  ISR, CSR을 조합하는 하이브리드 렌더링 아키텍처를 설계 및 구축. 'use client'
  경계를 명확히 하여 클라이언트 번들 사이즈 최소화

- **성과**: Hydration Mismatch 및 RSC 경계 문제를 해결하며 서버클라이언트
  렌더링 아키텍처에 대한 깊이 있는 이해를 확보.
  Next.js의 렌더링 전략 (ISR)과 TanStack Query의 HydrationBoundary 를 결합하여
  서버 상태와 클라이언트 상태를 효율적으로 동기화. 불필요한 Refetch를 방지하고
  FCP를 6.9초에서 1.7초로 단축.

### [Next/Image 비용 문제로 커스텀 Image 컴포넌트 설계](https://glass-writer-f4a.notion.site/Frontend-Developer-2485aca8e19380c7ac2ed382051884f3?p=2485aca8e193806dbe80ca4a089fc7dc&pm=c)

- **문제**: Vercel Image Optimization 기능의 월 5,000회 제한으로 인한 **비용 발생**
  및 **서비스 확장성** 문제 발견

- **해결**: 핵심 이미지를 제외한 **재사용 가능한 커스텀 Image 컴포넌트 구현**. Lazy
  Loading, Skeleton UI, 웹 접근성을 적용하여 성능과 사용자 경험 동시 최적화

- **성과**: Vercel 이미지 최적화 API 호출 **80% 이상 절감**을 통해 비용 효율성 확보
  **CLS(누적 레이아웃 이동) 방지**로 시각적 안정성 및 사용자 경험 향상

### 프로젝트 시작

First, run the development server:

```bash
npm run dev
```
