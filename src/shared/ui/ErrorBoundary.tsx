"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "./shadcn/button";
import { useRouter } from "next/navigation";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "🚨 [ErrorBoundary] Component error caught:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      // 사용자 정의 fallback UI가 있으면 사용, 없으면 기본 UI
      const router = useRouter();
      return (
        this.props.fallback || (
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-sm text-gray-500">잠시 문제가 발생했어요.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
            >
              메인으로 이동하기
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
