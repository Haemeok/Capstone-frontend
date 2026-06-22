import { useRecipeGridDict } from "@/shared/i18n";

type EmptyFilterStateProps = {
  noResultsMessage: string;
  onResetFilters?: () => void;
};

const EmptyFilterState = ({
  noResultsMessage,
  onResetFilters,
}: EmptyFilterStateProps) => {
  const t = useRecipeGridDict();
  return (
    <section className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4">
      <div className="text-center">
        <p className="text-ink-sub text-lg font-medium">
          {onResetFilters ? t.filterEmptyTitle : noResultsMessage}
        </p>
        {onResetFilters && (
          <p className="text-ink-muted mt-1 text-sm">{t.filterEmptyDesc}</p>
        )}
      </div>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="text-ink-sub rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-200 active:scale-[0.98]"
        >
          {t.filterReset}
        </button>
      )}
    </section>
  );
};

export default EmptyFilterState;
