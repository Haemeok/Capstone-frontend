/**
 * Sentry 초기화 설정
 * Next.js 환경에서의 Sentry 설정 및 초기화
 */

import * as Sentry from "@sentry/nextjs";

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // 성능 모니터링 설정
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // 프로파일링 설정
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // 디버그 모드 (개발 환경에서만)
    debug: process.env.NODE_ENV === "development",

    // 에러 필터링
    beforeSend(event, hint) {
      // 개발 환경에서는 콘솔에도 출력
      if (process.env.NODE_ENV === "development") {
        console.error("Sentry Error:", event, hint);
      }

      // 특정 에러 타입 필터링
      if (event.exception) {
        const error = hint.originalException;

        // 네트워크 에러 중 일부는 무시 (예: 취소된 요청)
        if (error instanceof Error && error.name === "AbortError") {
          return null;
        }

        // 404 에러는 Sentry에서 무시
        if (event.tags?.httpStatus === "404") {
          return null;
        }
      }

      return event;
    },

    // 기본 태그 설정
    initialScope: {
      tags: {
        component: "frontend",
        version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
      },
    },

    // 통합 설정은 @sentry/nextjs에서 자동으로 처리

    // 릴리즈 설정
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  });
};

// 개발 환경에서만 Sentry 초기화를 위한 조건부 export
export const conditionalInitSentry = () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    initSentry();
  } else if (process.env.NODE_ENV === "development") {
    console.warn(
      "Sentry DSN이 설정되지 않았습니다. 에러 추적이 비활성화됩니다."
    );
  }
};
