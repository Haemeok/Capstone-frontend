"use client";

import { Suspense } from "react";

import { LOGIN_IMAGE_URL } from "@/shared/config/constants/user";

import LoginContent from "./components/LoginContent";

const LoginPage = () => {
  return (
    <div className="scrollbar-hide flex h-screen flex-col items-center justify-center gap-2 overflow-y-auto">
      <img src={LOGIN_IMAGE_URL} alt="login" className="mb-4 p-4" />
      <Suspense fallback={<div>로딩 중...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
};

export default LoginPage;
