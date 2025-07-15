"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
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
    return { hasError: true };
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
      return this.props.fallback; // 문제가 생기면 전달받은 fallback을 렌더링
    }

    return this.props.children;
  }
}
