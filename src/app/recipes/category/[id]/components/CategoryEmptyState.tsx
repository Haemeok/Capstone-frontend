import Link from "next/link";

type CategoryEmptyStateProps = {
  tagName: string;
};

const CategoryEmptyState = ({ tagName }: CategoryEmptyStateProps) => {
  return (
    <div className="flex flex-col items-start gap-3 px-4 pt-16 pb-10">
      <p className="text-ink text-base font-semibold">
        아직 {tagName} 레시피가 없어요
      </p>
      <p className="text-ink-muted text-sm">
        첫 번째 레시피를 직접 만들어보세요.
      </p>
      <Link
        href="/recipes/new"
        className="bg-olive-light active:bg-olive-dark mt-1 inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-bold text-white transition-colors"
      >
        레시피 만들기
      </Link>
    </div>
  );
};

export default CategoryEmptyState;
