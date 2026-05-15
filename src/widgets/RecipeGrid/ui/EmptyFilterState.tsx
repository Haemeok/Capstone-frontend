type EmptyFilterStateProps = {
  noResultsMessage: string;
  onResetFilters?: () => void;
};

const EmptyFilterState = ({
  noResultsMessage,
  onResetFilters,
}: EmptyFilterStateProps) => (
  <section className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4">
    <div className="text-center">
      <p className="text-lg font-medium text-gray-700">
        {onResetFilters
          ? "설정하신 조건에 맞는 레시피가 없어요"
          : noResultsMessage}
      </p>
      {onResetFilters && (
        <p className="mt-1 text-sm text-gray-500">
          다른 검색어나 필터로 변경해 보세요
        </p>
      )}
    </div>
    {onResetFilters && (
      <button
        onClick={onResetFilters}
        className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 active:scale-[0.98]"
      >
        필터 초기화
      </button>
    )}
  </section>
);

export default EmptyFilterState;
