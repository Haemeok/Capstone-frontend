"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui/shadcn/button";

type AIRecipeErrorProps = {
  error: string;
  onRetry?: () => void;
};

const AIRecipeError = ({ error, onRetry }: AIRecipeErrorProps) => {
  return (
    <div className="flex items-center justify-center bg-[#f7f7f7] p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>

          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              레시피 생성 실패
            </h1>
            <p className="mb-4 text-gray-600">
              레시피 생성 중 문제가 발생했습니다.
            </p>
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={onRetry}
              className="bg-olive-mint hover:bg-olive-mint/90 h-12 w-full rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
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
