"use client";

import { AlertCircle, RotateCcw } from "lucide-react";

import { useT } from "@/shared/i18n";
import { Button } from "@/shared/ui/shadcn/button";

type AIRecipeErrorProps = {
  error: string;
  onRetry?: () => void;
};

const AIRecipeError = ({ error, onRetry }: AIRecipeErrorProps) => {
  const t = useT();

  return (
    <div className="flex h-full items-center justify-center bg-[#f7f7f7] p-4">
      <div className="w-full max-w-md">
        <div className="space-y-6 rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>

          <div>
            <h1 className="text-ink mb-2 text-2xl font-bold">
              {t.aiRecipe.error.failureHeading}
            </h1>
            <p className="text-ink-sub mb-4">{t.aiRecipe.error.failureBody}</p>
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
              {t.aiRecipe.error.retryButton}
            </Button>
          </div>

          <div className="text-ink-muted text-sm">
            {t.aiRecipe.error.persistentTip}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecipeError;
