import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";

import RecipeSlide from "./index";

type RecipeSlideWithErrorBoundaryProps = {
  title: string;
  queryKey: string;
  isAiGenerated?: boolean;
  tags?: string[];
  to?: string;
  maxCost?: number;
  period?: "weekly" | "monthly";
};

const RecipeSlideWithErrorBoundary = (
  props: RecipeSlideWithErrorBoundaryProps
) => {
  const { title } = props;

  return (
    <ErrorBoundary
      fallback={
        <div className="mt-2 w-full">
          <h2 className="mb-4 text-xl font-bold text-gray-800">{title}</h2>
          <div className="flex w-full items-center justify-center py-8">
            <p className="text-sm text-gray-500">
              {title}을 불러올 수 없어요. 새로고침해주세요.
            </p>
          </div>
        </div>
      }
    >
      <RecipeSlide {...props} />
    </ErrorBoundary>
  );
};

export default RecipeSlideWithErrorBoundary;
