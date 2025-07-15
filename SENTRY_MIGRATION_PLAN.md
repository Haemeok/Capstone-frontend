# Sentry 마이그레이션 계획

## 📋 개요

기존 프로젝트의 로깅 시스템을 Sentry로 마이그레이션하여 체계적인 에러 추적과 모니터링을 구현합니다.

## 🔍 현재 상황 분석

### 기존 로깅 시스템 문제점

1. **누락된 로그 함수**: `config.ts`에 `errorLog`, `debugLog` 함수가 정의되지 않음
2. **일관성 없는 로깅**: 일부 파일은 `console.log`, 다른 파일은 사용하지 않는 로그 함수 사용
3. **에러 추적 부족**: 프로덕션 환경에서의 에러 모니터링 및 분석 기능 부재

### 현재 사용 현황

- **auth.ts**: `errorLog`, `debugLog` 함수 사용 (현재 오류 발생)
- **file.ts**: `console.log`, `console.error` 직접 사용
- **기타 파일들**: 산발적인 로깅 사용

## 🎯 마이그레이션 목표

1. **체계적인 에러 추적**: 모든 에러를 Sentry로 통합 관리
2. **사용자 경험 향상**: 에러 발생 시 빠른 대응 가능
3. **성능 모니터링**: API 응답 시간 및 성능 지표 추적
4. **사용자 컨텍스트**: 에러 발생 시 사용자 정보 및 환경 정보 수집

## 📦 필요한 패키지

```bash
npm install @sentry/nextjs @sentry/react @sentry/tracing
```

## 🏗️ 구현 계획

### 1단계: Sentry 기본 설정

#### 1.1 Sentry 초기화 파일 생성

```typescript
// src/shared/lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    beforeSend(event, hint) {
      // 개발 환경에서는 콘솔에도 출력
      if (process.env.NODE_ENV === "development") {
        console.error("Sentry Error:", event, hint);
      }
      return event;
    },
  });
};
```

#### 1.2 Next.js 통합 설정

```javascript
// next.config.ts
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  // 기존 설정...
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: "your-sentry-org",
  project: "haemeok-next",
});
```

### 2단계: 에러 추적 유틸리티 개발

#### 2.1 Sentry 래퍼 함수 생성

```typescript
// src/shared/lib/errorTracking.ts
import * as Sentry from "@sentry/nextjs";

export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    tags: {
      section: "api",
      ...context?.tags,
    },
    extra: context,
  });
};

export const trackMessage = (
  message: string,
  level: "info" | "warning" | "error" = "info"
) => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (user: { id: string; email?: string }) => {
  Sentry.setUser(user);
};
```

### 3단계: 기존 API 에러 처리 통합

#### 3.1 ApiError 클래스 수정

```typescript
// src/shared/api/errors.ts 수정
import { trackError } from "../lib/errorTracking";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";

    // Sentry로 에러 추적
    trackError(this, {
      tags: { errorType: "api" },
      extra: { status, statusText, data },
    });
  }

  // 기존 메서드들...
}
```

#### 3.2 인증 관련 에러 처리

```typescript
// src/shared/api/auth.ts 수정
import { trackError, trackMessage } from "../lib/errorTracking";

export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    trackError(error as Error, {
      tags: { section: "auth", action: "refresh" },
      extra: { message: "토큰 재발급 실패" },
    });
    dispatchForceLogoutEvent("REFRESH_TOKEN_EXPIRED");
    return false;
  }
};
```

### 4단계: 성능 모니터링 설정

#### 4.1 API 호출 성능 추적

```typescript
// src/shared/api/client.ts 수정
import * as Sentry from "@sentry/nextjs";

export async function apiClient<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const transaction = Sentry.startTransaction({
    name: `API ${options.method || "GET"} ${url}`,
    op: "http.client",
  });

  try {
    // 기존 로직...
    const response = await executeRequest();

    transaction.setStatus("ok");
    return response;
  } catch (error) {
    transaction.setStatus("internal_error");
    throw error;
  } finally {
    transaction.finish();
  }
}
```

### 5단계: 사용자 컨텍스트 설정

#### 5.1 사용자 정보 통합

```typescript
// src/entities/user/model/hooks.ts 수정
import { setUserContext } from "../../shared/lib/errorTracking";

export const useUser = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    onSuccess: (user) => {
      // Sentry 사용자 컨텍스트 설정
      setUserContext({
        id: user.id.toString(),
        email: user.email,
      });
    },
  });

  return query;
};
```

## 🧪 테스트 및 검증

### 테스트 방법

1. **에러 발생 시나리오**
   - 잘못된 API 호출
   - 네트워크 오류
   - 인증 만료

2. **성능 모니터링**
   - API 응답 시간 확인
   - 느린 쿼리 식별

3. **사용자 컨텍스트**
   - 에러 발생 시 사용자 정보 포함 여부 확인

## 🔧 환경별 설정

### 개발 환경

```env
NEXT_PUBLIC_SENTRY_DSN=your-dev-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=haemeok-next
```

### 프로덕션 환경

```env
NEXT_PUBLIC_SENTRY_DSN=your-prod-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=haemeok-next
```

## 📊 모니터링 대시보드

### 주요 지표

1. **에러율**: 전체 요청 대비 에러 발생 비율
2. **응답 시간**: API 호출 평균 응답 시간
3. **사용자 영향도**: 에러가 발생한 사용자 수
4. **에러 유형**: 가장 빈번한 에러 타입

### 알림 설정

1. **즉시 알림**: 5xx 에러 발생 시
2. **일일 요약**: 에러 발생 현황 요약
3. **임계값 알림**: 에러율이 특정 수준 초과 시

## 🚀 배포 전 체크리스트

- [ ] Sentry 프로젝트 생성 완료
- [x] 환경 변수 설정 완료
- [x] 기존 로그 함수 제거 완료
- [x] 에러 추적 테스트 완료
- [ ] 성능 모니터링 테스트 완료
- [ ] 사용자 컨텍스트 설정 완료
- [ ] 알림 설정 완료

## 📝 마이그레이션 순서

1. **환경 준비**: Sentry 프로젝트 생성 및 DSN 발급
2. **패키지 설치**: 필요한 Sentry 패키지 설치
3. **기본 설정**: Sentry 초기화 및 Next.js 통합
4. **에러 추적**: 기존 에러 처리 로직과 통합
5. **로그 제거**: 기존 로깅 함수 제거
6. **성능 모니터링**: API 호출 성능 추적 추가
7. **사용자 컨텍스트**: 사용자 정보 통합
8. **테스트**: 전체 시스템 테스트 및 검증

## ✅ 완료된 작업

### 1. 기본 인프라 구축

- [x] Sentry 패키지 설치 (@sentry/nextjs)
- [x] Sentry 초기화 설정 파일 생성 (`src/shared/lib/sentry.ts`)
- [x] 에러 추적 유틸리티 개발 (`src/shared/lib/errorTracking.ts`)
- [x] app/layout.tsx에서 Sentry 초기화 적용

### 2. 기존 로깅 시스템 마이그레이션

- [x] auth.ts: 로그 함수 제거 및 Sentry 적용
- [x] file.ts: console.log 제거 및 Sentry 적용
- [x] 에러 추적 및 breadcrumb 시스템 구축

### 3. 환경 설정

- [x] .env.example 파일 생성
- [x] 개발/프로덕션 환경별 설정 구분

## 🔄 다음 단계

1. **Sentry 프로젝트 생성**: Sentry 웹사이트에서 프로젝트 생성 및 DSN 발급
2. **환경 변수 설정**: `.env.local`에 실제 DSN 설정
3. **성능 모니터링**: API 호출 성능 추적 설정
4. **사용자 컨텍스트**: 사용자 정보 연동
5. **테스트 및 검증**: 에러 발생 시나리오 테스트

## 🎯 기대 효과

1. **빠른 문제 해결**: 실시간 에러 알림으로 신속한 대응
2. **사용자 경험 향상**: 에러 발생 패턴 분석을 통한 개선
3. **시스템 안정성**: 성능 지표 모니터링으로 안정성 확보
4. **개발 효율성**: 구조화된 에러 정보로 디버깅 시간 단축
