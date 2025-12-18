"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

type AIRecipeErrorProps = {
  error: string;
  onRetry?: () => void;
};

const AIRecipeError = ({ error, onRetry }: AIRecipeErrorProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-2xl text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              레시피 생성 실패
            </h1>
            <p className="text-gray-600 mb-4">
              레시피 생성 중 문제가 발생했습니다.
            </p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={onRetry}
              className="w-full h-12 bg-olive-mint hover:bg-olive-mint/90 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              다시 시도하기
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            문제가 계속 발생하면 잠시 후 다시 시도해주세요.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecipeError;
