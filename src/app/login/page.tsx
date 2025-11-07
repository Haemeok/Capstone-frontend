"use client";

import { Suspense } from "react";

import LoginContent from "./components/LoginContent";

const LoginPage = () => {
  return (
    <div className="scrollbar-hide flex h-screen flex-col items-center justify-center gap-2 overflow-y-auto">
      <Suspense fallback={<div>로딩 중...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
};

export default LoginPage;
